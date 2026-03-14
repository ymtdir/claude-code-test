import { v4 as uuidv4 } from 'uuid';
import { TaskSchema } from '../schema/taskSchema';

export class TaskModel implements TaskSchema {
  id: string;
  title: string;
  category: string;
  date: Date;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'cancelled';
  completedAt?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<TaskSchema>) {
    this.id = data.id || uuidv4();
    this.title = data.title || '';
    this.category = data.category || 'work';
    this.date = data.date ? new Date(data.date) : new Date();
    this.time = data.time;
    this.priority = data.priority || 'medium';
    this.status = data.status || 'pending';
    this.completedAt = data.completedAt
      ? new Date(data.completedAt)
      : undefined;
    this.note = data.note;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  // Helper methods
  markAsCompleted(): TaskModel {
    this.status = 'completed';
    this.completedAt = new Date();
    this.updatedAt = new Date();
    return this;
  }

  markAsPending(): TaskModel {
    this.status = 'pending';
    this.completedAt = undefined;
    this.updatedAt = new Date();
    return this;
  }

  markAsCancelled(): TaskModel {
    this.status = 'cancelled';
    this.updatedAt = new Date();
    return this;
  }

  updatePriority(priority: 'low' | 'medium' | 'high'): TaskModel {
    this.priority = priority;
    this.updatedAt = new Date();
    return this;
  }

  // Convert to plain object for database storage
  toPlainObject(): TaskSchema {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      date: this.date,
      time: this.time,
      priority: this.priority,
      status: this.status,
      completedAt: this.completedAt,
      note: this.note,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Create from database record
  static fromDatabase(data: TaskSchema): TaskModel {
    return new TaskModel(data);
  }
}
