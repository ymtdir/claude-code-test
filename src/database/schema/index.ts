import { taskTableSchema } from './taskSchema';
import { calendarTableSchema } from './calendarSchema';
import { reminderTableSchema } from './reminderSchema';

export * from './taskSchema';
export * from './calendarSchema';
export * from './reminderSchema';

// Combine all schemas for Dexie database initialization
export const databaseSchema = {
  ...taskTableSchema,
  ...calendarTableSchema,
  ...reminderTableSchema,
};
