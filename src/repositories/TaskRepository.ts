import { db } from '../database';
import { TaskModel } from '../database/models';
import type { TaskSchema } from '../database/schema';

export class TaskRepository {
  /**
   * Find all tasks
   */
  static async findAll(): Promise<TaskModel[]> {
    const tasks = await db.tasks.toArray();
    return tasks.map((task) => TaskModel.fromDatabase(task));
  }

  /**
   * Find tasks by date
   */
  static async findByDate(date: Date): Promise<TaskModel[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await db.tasks
      .where('date')
      .between(startOfDay, endOfDay)
      .toArray();

    return tasks.map((task) => TaskModel.fromDatabase(task));
  }

  /**
   * Find task by ID
   */
  static async findById(id: string): Promise<TaskModel | null> {
    const task = await db.tasks.get(id);
    return task ? TaskModel.fromDatabase(task) : null;
  }

  /**
   * Create a new task
   */
  static async create(data: Partial<TaskSchema>): Promise<TaskModel> {
    const taskModel = new TaskModel(data);
    const taskData = taskModel.toPlainObject();

    await db.tasks.add(taskData, taskData.id);

    return taskModel;
  }

  /**
   * Update an existing task
   */
  static async update(
    id: string,
    data: Partial<TaskSchema>
  ): Promise<TaskModel | null> {
    const existingTask = await db.tasks.get(id);

    if (!existingTask) {
      return null;
    }

    const updatedData = {
      ...existingTask,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    await db.tasks.update(id, updatedData);

    return TaskModel.fromDatabase(updatedData);
  }

  /**
   * Delete a task
   */
  static async delete(id: string): Promise<boolean> {
    try {
      await db.transaction('rw', db.tasks, db.reminders, async () => {
        // Delete associated reminders
        await db.reminders.where('taskId').equals(id).delete();
        // Delete the task
        await db.tasks.delete(id);
      });
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  /**
   * Bulk create tasks
   */
  static async bulkCreate(tasks: Partial<TaskSchema>[]): Promise<TaskModel[]> {
    const taskModels = tasks.map((task) => new TaskModel(task));
    const taskData = taskModels.map((model) => model.toPlainObject());

    await db.tasks.bulkAdd(taskData);

    return taskModels;
  }

  /**
   * Find tasks by status
   */
  static async findByStatus(
    status: 'pending' | 'completed' | 'cancelled'
  ): Promise<TaskModel[]> {
    const tasks = await db.tasks.where('status').equals(status).toArray();

    return tasks.map((task) => TaskModel.fromDatabase(task));
  }

  /**
   * Find tasks by category
   */
  static async findByCategory(category: string): Promise<TaskModel[]> {
    const tasks = await db.tasks.where('category').equals(category).toArray();

    return tasks.map((task) => TaskModel.fromDatabase(task));
  }

  /**
   * Find tasks by date range
   */
  static async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TaskModel[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const tasks = await db.tasks.where('date').between(start, end).toArray();

    return tasks.map((task) => TaskModel.fromDatabase(task));
  }

  /**
   * Find overdue tasks
   */
  static async findOverdue(): Promise<TaskModel[]> {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const tasks = await db.tasks
      .where('[date+status]')
      .between([new Date(0), 'pending'], [now, 'pending'])
      .toArray();

    return tasks.map((task) => TaskModel.fromDatabase(task));
  }

  /**
   * Mark task as completed
   */
  static async markAsCompleted(id: string): Promise<TaskModel | null> {
    const task = await this.findById(id);

    if (!task) {
      return null;
    }

    task.markAsCompleted();

    await db.tasks.update(id, task.toPlainObject());

    return task;
  }

  /**
   * Get task statistics
   */
  static async getStatistics(): Promise<{
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    overdue: number;
  }> {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const [total, pending, completed, cancelled, overdue] = await Promise.all([
      db.tasks.count(),
      db.tasks.where('status').equals('pending').count(),
      db.tasks.where('status').equals('completed').count(),
      db.tasks.where('status').equals('cancelled').count(),
      db.tasks
        .where('[date+status]')
        .between([new Date(0), 'pending'], [now, 'pending'])
        .count(),
    ]);

    return {
      total,
      pending,
      completed,
      cancelled,
      overdue,
    };
  }

  /**
   * Search tasks by title
   */
  static async searchByTitle(query: string): Promise<TaskModel[]> {
    const tasks = await db.tasks
      .filter((task) => task.title.toLowerCase().includes(query.toLowerCase()))
      .toArray();

    return tasks.map((task) => TaskModel.fromDatabase(task));
  }
}
