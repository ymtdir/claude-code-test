export interface CalendarSchema {
  id?: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const calendarTableSchema = {
  calendars: 'id, name, isDefault',
};
