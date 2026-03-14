export interface ReminderSchema {
  id?: string;
  taskId: string;
  type:
    | 'none'
    | 'at_time'
    | '5_minutes'
    | '10_minutes'
    | '15_minutes'
    | '30_minutes'
    | '1_hour';
  timeOffset?: number; // minutes before task time
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const reminderTableSchema = {
  reminders: 'id, taskId, isActive',
};
