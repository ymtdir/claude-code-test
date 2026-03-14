import { db } from '../database';
import { ReminderModel } from '../database/models';
import type { ReminderSchema } from '../database/schema';

export class ReminderRepository {
  /**
   * Find all reminders
   */
  static async findAll(): Promise<ReminderModel[]> {
    const reminders = await db.reminders.toArray();
    return reminders.map((reminder) => ReminderModel.fromDatabase(reminder));
  }

  /**
   * Find reminder by ID
   */
  static async findById(id: string): Promise<ReminderModel | null> {
    const reminder = await db.reminders.get(id);
    return reminder ? ReminderModel.fromDatabase(reminder) : null;
  }

  /**
   * Find reminders by task ID
   */
  static async findByTaskId(taskId: string): Promise<ReminderModel[]> {
    const reminders = await db.reminders
      .where('taskId')
      .equals(taskId)
      .toArray();
    return reminders.map((reminder) => ReminderModel.fromDatabase(reminder));
  }

  /**
   * Find active reminders
   */
  static async findActive(): Promise<ReminderModel[]> {
    const reminders = await db.reminders.where('isActive').equals(1).toArray();
    return reminders.map((reminder) => ReminderModel.fromDatabase(reminder));
  }

  /**
   * Find active reminders for a specific task
   */
  static async findActiveByTaskId(
    taskId: string
  ): Promise<ReminderModel | null> {
    const reminder = await db.reminders
      .where('[taskId+isActive]')
      .equals([taskId, 1])
      .first();
    return reminder ? ReminderModel.fromDatabase(reminder) : null;
  }

  /**
   * Create a new reminder
   */
  static async create(data: Partial<ReminderSchema>): Promise<ReminderModel> {
    const reminderModel = new ReminderModel(data);
    const reminderData = reminderModel.toPlainObject();

    await db.reminders.add(reminderData, reminderData.id);

    return reminderModel;
  }

  /**
   * Update an existing reminder
   */
  static async update(
    id: string,
    data: Partial<ReminderSchema>
  ): Promise<ReminderModel | null> {
    const existingReminder = await db.reminders.get(id);

    if (!existingReminder) {
      return null;
    }

    const updatedData = {
      ...existingReminder,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    await db.reminders.update(id, updatedData);

    return ReminderModel.fromDatabase(updatedData);
  }

  /**
   * Delete a reminder
   */
  static async delete(id: string): Promise<boolean> {
    try {
      await db.reminders.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  }

  /**
   * Delete all reminders for a task
   */
  static async deleteByTaskId(taskId: string): Promise<number> {
    return await db.reminders.where('taskId').equals(taskId).delete();
  }

  /**
   * Create or update reminder for a task
   */
  static async upsertForTask(
    taskId: string,
    data: Partial<ReminderSchema>
  ): Promise<ReminderModel> {
    // Check if a reminder already exists for this task
    const existingReminder = await db.reminders
      .where('taskId')
      .equals(taskId)
      .first();

    if (existingReminder) {
      // Update existing reminder
      return (await this.update(existingReminder.id!, data)) as ReminderModel;
    } else {
      // Create new reminder
      return await this.create({
        ...data,
        taskId,
      });
    }
  }

  /**
   * Activate a reminder
   */
  static async activate(id: string): Promise<ReminderModel | null> {
    const reminder = await this.findById(id);

    if (!reminder) {
      return null;
    }

    reminder.activate();
    await db.reminders.update(id, reminder.toPlainObject());

    return reminder;
  }

  /**
   * Deactivate a reminder
   */
  static async deactivate(id: string): Promise<ReminderModel | null> {
    const reminder = await this.findById(id);

    if (!reminder) {
      return null;
    }

    reminder.deactivate();
    await db.reminders.update(id, reminder.toPlainObject());

    return reminder;
  }

  /**
   * Get reminders that should trigger within a time range
   */
  static async getUpcomingReminders(
    fromTime: Date,
    toTime: Date
  ): Promise<
    {
      reminder: ReminderModel;
      triggerTime: Date;
    }[]
  > {
    const activeReminders = await this.findActive();
    const results: { reminder: ReminderModel; triggerTime: Date }[] = [];

    for (const reminder of activeReminders) {
      // Get the associated task
      const task = await db.tasks.get(reminder.taskId);

      if (task && task.date) {
        const triggerTime = reminder.getReminderTime(task.date, task.time);

        if (triggerTime && triggerTime >= fromTime && triggerTime <= toTime) {
          results.push({
            reminder,
            triggerTime,
          });
        }
      }
    }

    return results.sort(
      (a, b) => a.triggerTime.getTime() - b.triggerTime.getTime()
    );
  }

  /**
   * Get reminder statistics
   */
  static async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
  }> {
    const reminders = await db.reminders.toArray();

    const stats = {
      total: reminders.length,
      active: 0,
      inactive: 0,
      byType: {} as Record<string, number>,
    };

    for (const reminder of reminders) {
      if (reminder.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }

      if (!stats.byType[reminder.type]) {
        stats.byType[reminder.type] = 0;
      }
      stats.byType[reminder.type]++;
    }

    return stats;
  }
}
