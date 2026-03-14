import Dexie, { Table } from 'dexie';
import {
  TaskSchema,
  CalendarSchema,
  ReminderSchema,
  databaseSchema,
} from './schema';

export class UnifiedCalDatabase extends Dexie {
  // Declare tables
  tasks!: Table<TaskSchema, string>;
  calendars!: Table<CalendarSchema, string>;
  reminders!: Table<ReminderSchema, string>;

  constructor() {
    super('UnifiedCalDB');

    // Define database schema version 1
    this.version(1).stores(databaseSchema);

    // Add hooks for automatic timestamp management
    this.tasks.hook('creating', (primKey, obj) => {
      const now = new Date();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.tasks.hook('updating', (modifications) => {
      modifications.updatedAt = new Date();
    });

    this.calendars.hook('creating', (primKey, obj) => {
      const now = new Date();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.calendars.hook('updating', (modifications) => {
      modifications.updatedAt = new Date();
    });

    this.reminders.hook('creating', (primKey, obj) => {
      const now = new Date();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.reminders.hook('updating', (modifications) => {
      modifications.updatedAt = new Date();
    });
  }

  // Helper method to clear all data
  async clearAllData(): Promise<void> {
    await this.transaction(
      'rw',
      this.tasks,
      this.calendars,
      this.reminders,
      async () => {
        await Promise.all([
          this.tasks.clear(),
          this.calendars.clear(),
          this.reminders.clear(),
        ]);
      }
    );
  }

  // Helper method to seed initial data
  async seedInitialData(): Promise<void> {
    const defaultCalendar: CalendarSchema = {
      id: 'default-calendar',
      name: 'Personal',
      color: '#007AFF',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.transaction('rw', this.calendars, async () => {
      const existingDefault = await this.calendars
        .where('isDefault')
        .equals(1)
        .first();
      if (!existingDefault) {
        await this.calendars.add(defaultCalendar);
      }
    });
  }

  // Helper method to export database
  async exportData(): Promise<{
    tasks: TaskSchema[];
    calendars: CalendarSchema[];
    reminders: ReminderSchema[];
  }> {
    const [tasks, calendars, reminders] = await Promise.all([
      this.tasks.toArray(),
      this.calendars.toArray(),
      this.reminders.toArray(),
    ]);

    return { tasks, calendars, reminders };
  }

  // Helper method to import data
  async importData(data: {
    tasks?: TaskSchema[];
    calendars?: CalendarSchema[];
    reminders?: ReminderSchema[];
  }): Promise<void> {
    await this.transaction(
      'rw',
      this.tasks,
      this.calendars,
      this.reminders,
      async () => {
        if (data.tasks) {
          await this.tasks.bulkPut(data.tasks);
        }
        if (data.calendars) {
          await this.calendars.bulkPut(data.calendars);
        }
        if (data.reminders) {
          await this.reminders.bulkPut(data.reminders);
        }
      }
    );
  }
}
