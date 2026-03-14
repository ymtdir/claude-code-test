import { v4 as uuidv4 } from 'uuid';
import type { ReminderSchema } from '../schema/reminderSchema';

export class ReminderModel implements ReminderSchema {
  id: string;
  taskId: string;
  type:
    | 'none'
    | 'at_time'
    | '5_minutes'
    | '10_minutes'
    | '15_minutes'
    | '30_minutes'
    | '1_hour';
  timeOffset?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ReminderSchema>) {
    this.id = data.id || uuidv4();
    this.taskId = data.taskId || '';
    this.type = data.type || 'none';
    this.timeOffset = data.timeOffset;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

    // Calculate timeOffset based on type if not provided
    if (this.type !== 'none' && this.type !== 'at_time' && !this.timeOffset) {
      this.calculateTimeOffset();
    }
  }

  // Calculate time offset based on reminder type
  private calculateTimeOffset(): void {
    const offsetMap: Record<string, number> = {
      '5_minutes': 5,
      '10_minutes': 10,
      '15_minutes': 15,
      '30_minutes': 30,
      '1_hour': 60,
    };

    if (this.type in offsetMap) {
      this.timeOffset = offsetMap[this.type];
    }
  }

  // Helper methods
  activate(): ReminderModel {
    this.isActive = true;
    this.updatedAt = new Date();
    return this;
  }

  deactivate(): ReminderModel {
    this.isActive = false;
    this.updatedAt = new Date();
    return this;
  }

  updateType(type: ReminderModel['type']): ReminderModel {
    this.type = type;
    this.calculateTimeOffset();
    this.updatedAt = new Date();
    return this;
  }

  // Get reminder time based on task time
  getReminderTime(taskDate: Date, taskTime?: string): Date | null {
    if (!this.isActive || this.type === 'none') {
      return null;
    }

    const reminderDate = new Date(taskDate);

    if (taskTime) {
      const [hours, minutes] = taskTime.split(':').map(Number);
      reminderDate.setHours(hours, minutes, 0, 0);
    }

    if (this.type === 'at_time') {
      return reminderDate;
    }

    if (this.timeOffset) {
      reminderDate.setMinutes(reminderDate.getMinutes() - this.timeOffset);
    }

    return reminderDate;
  }

  // Convert to plain object for database storage
  toPlainObject(): ReminderSchema {
    return {
      id: this.id,
      taskId: this.taskId,
      type: this.type,
      timeOffset: this.timeOffset,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Create from database record
  static fromDatabase(data: ReminderSchema): ReminderModel {
    return new ReminderModel(data);
  }

  // Predefined reminder types with labels
  static readonly REMINDER_TYPES = {
    NONE: { value: 'none' as const, label: 'No Reminder' },
    AT_TIME: { value: 'at_time' as const, label: 'At time of event' },
    FIVE_MINUTES: { value: '5_minutes' as const, label: '5 minutes before' },
    TEN_MINUTES: { value: '10_minutes' as const, label: '10 minutes before' },
    FIFTEEN_MINUTES: {
      value: '15_minutes' as const,
      label: '15 minutes before',
    },
    THIRTY_MINUTES: {
      value: '30_minutes' as const,
      label: '30 minutes before',
    },
    ONE_HOUR: { value: '1_hour' as const, label: '1 hour before' },
  };
}
