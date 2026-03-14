import { db } from '../database';
import { CalendarModel } from '../database/models';
import type { CalendarSchema } from '../database/schema';

export class CalendarRepository {
  /**
   * Find all calendars
   */
  static async findAll(): Promise<CalendarModel[]> {
    const calendars = await db.calendars.toArray();
    return calendars.map((calendar) => CalendarModel.fromDatabase(calendar));
  }

  /**
   * Find calendar by ID
   */
  static async findById(id: string): Promise<CalendarModel | null> {
    const calendar = await db.calendars.get(id);
    return calendar ? CalendarModel.fromDatabase(calendar) : null;
  }

  /**
   * Find default calendar
   */
  static async findDefault(): Promise<CalendarModel | null> {
    const calendar = await db.calendars.where('isDefault').equals(1).first();
    return calendar ? CalendarModel.fromDatabase(calendar) : null;
  }

  /**
   * Create a new calendar
   */
  static async create(data: Partial<CalendarSchema>): Promise<CalendarModel> {
    const calendarModel = new CalendarModel(data);
    const calendarData = calendarModel.toPlainObject();

    // If this is set as default, unset other defaults
    if (calendarData.isDefault) {
      await db.transaction('rw', db.calendars, async () => {
        await db.calendars
          .where('isDefault')
          .equals(1)
          .modify({ isDefault: false });

        await db.calendars.add(calendarData, calendarData.id);
      });
    } else {
      await db.calendars.add(calendarData, calendarData.id);
    }

    return calendarModel;
  }

  /**
   * Update an existing calendar
   */
  static async update(
    id: string,
    data: Partial<CalendarSchema>
  ): Promise<CalendarModel | null> {
    const existingCalendar = await db.calendars.get(id);

    if (!existingCalendar) {
      return null;
    }

    const updatedData = {
      ...existingCalendar,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    // If setting as default, unset other defaults
    if (updatedData.isDefault && !existingCalendar.isDefault) {
      await db.transaction('rw', db.calendars, async () => {
        await db.calendars
          .where('isDefault')
          .equals(1)
          .modify({ isDefault: false });

        await db.calendars.update(id, updatedData);
      });
    } else {
      await db.calendars.update(id, updatedData);
    }

    return CalendarModel.fromDatabase(updatedData);
  }

  /**
   * Delete a calendar
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const calendar = await db.calendars.get(id);

      if (!calendar) {
        return false;
      }

      // Don't allow deleting the default calendar
      if (calendar.isDefault) {
        console.error('Cannot delete default calendar');
        return false;
      }

      await db.calendars.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting calendar:', error);
      return false;
    }
  }

  /**
   * Set a calendar as default
   */
  static async setAsDefault(id: string): Promise<CalendarModel | null> {
    const calendar = await this.findById(id);

    if (!calendar) {
      return null;
    }

    await db.transaction('rw', db.calendars, async () => {
      // Unset all other defaults
      await db.calendars
        .where('isDefault')
        .equals(1)
        .modify({ isDefault: false });

      // Set this calendar as default
      await db.calendars.update(id, { isDefault: true });
    });

    calendar.setAsDefault();
    return calendar;
  }

  /**
   * Get calendar count
   */
  static async count(): Promise<number> {
    return await db.calendars.count();
  }

  /**
   * Ensure at least one default calendar exists
   */
  static async ensureDefault(): Promise<void> {
    const defaultCalendar = await this.findDefault();

    if (!defaultCalendar) {
      // No default calendar exists, create one
      await this.create({
        name: 'Personal',
        color: CalendarModel.COLORS.BLUE,
        isDefault: true,
      });
    }
  }
}
