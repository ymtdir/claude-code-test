import { v4 as uuidv4 } from 'uuid';
import type { CalendarSchema } from '../schema/calendarSchema';

export class CalendarModel implements CalendarSchema {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<CalendarSchema>) {
    this.id = data.id || uuidv4();
    this.name = data.name || 'My Calendar';
    this.color = data.color || '#007AFF'; // Default iOS blue
    this.isDefault = data.isDefault !== undefined ? data.isDefault : false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  // Helper methods
  setAsDefault(): CalendarModel {
    this.isDefault = true;
    this.updatedAt = new Date();
    return this;
  }

  updateColor(color: string): CalendarModel {
    this.color = color;
    this.updatedAt = new Date();
    return this;
  }

  updateName(name: string): CalendarModel {
    this.name = name;
    this.updatedAt = new Date();
    return this;
  }

  // Convert to plain object for database storage
  toPlainObject(): CalendarSchema {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      isDefault: this.isDefault,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Create from database record
  static fromDatabase(data: CalendarSchema): CalendarModel {
    return new CalendarModel(data);
  }

  // Predefined calendar colors
  static readonly COLORS = {
    BLUE: '#007AFF',
    GREEN: '#34C759',
    INDIGO: '#5856D6',
    ORANGE: '#FF9500',
    PINK: '#FF2D55',
    PURPLE: '#AF52DE',
    RED: '#FF3B30',
    TEAL: '#5AC8FA',
    YELLOW: '#FFCC00',
  };
}
