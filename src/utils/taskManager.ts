/**
 * TaskManagerクラス
 * タスクの作成、更新、削除、取得を管理するユーティリティ
 * データベース（IndexedDB）を使用した永続化対応版
 */

import type {
  Task,
  TaskInput,
  TaskStatus,
  Priority,
  Category,
} from '../types/task';
import { DEFAULT_CATEGORY } from '../constants/categories';
import { TaskRepository } from '../repositories';
import { TaskModel } from '../database/models';
import type { TaskSchema } from '../database/schema';

export class TaskManager {
  /**
   * ModelからTaskへの変換
   */
  private static modelToTask(model: TaskModel): Task {
    return {
      id: model.id,
      title: model.title,
      category: model.category as Category,
      date: model.date,
      time: model.time,
      priority: model.priority,
      status: model.status as TaskStatus,
      note: model.note,
      repeatRule: undefined, // TODO: リピート機能の実装
      reminders: [], // TODO: リマインダーとの連携
      sharedWith: [], // TODO: 共有機能の実装
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      completedAt: model.completedAt,
    };
  }

  /**
   * TaskからSchemaへの変換
   */
  private static taskToSchema(task: Partial<Task>): Partial<TaskSchema> {
    return {
      id: task.id,
      title: task.title,
      category: task.category,
      date: task.date,
      time: task.time,
      priority: task.priority,
      status: task.status as TaskSchema['status'],
      note: task.note,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt,
    };
  }

  /**
   * 新しいタスクを作成（非同期版）
   */
  static async createTask(data: TaskInput): Promise<Task> {
    const taskSchema = this.taskToSchema({
      ...data,
      status: 'pending' as TaskStatus,
      category: data.category || DEFAULT_CATEGORY,
      priority: data.priority || 'medium',
      date: data.date || new Date(),
    });

    const model = await TaskRepository.create(taskSchema);
    return this.modelToTask(model);
  }

  /**
   * タスクを更新（非同期版）
   */
  static async updateTask(
    id: string,
    updates: Partial<Task>
  ): Promise<Task | null> {
    const taskSchema = this.taskToSchema(updates);

    // タスクが完了状態に変更された場合、完了日時を設定
    if (updates.status === 'completed') {
      taskSchema.completedAt = new Date();
    }

    const model = await TaskRepository.update(id, taskSchema);
    return model ? this.modelToTask(model) : null;
  }

  /**
   * タスクを削除（非同期版）
   */
  static async deleteTask(id: string): Promise<boolean> {
    return await TaskRepository.delete(id);
  }

  /**
   * IDでタスクを取得（非同期版）
   */
  static async getTaskById(id: string): Promise<Task | null> {
    const model = await TaskRepository.findById(id);
    return model ? this.modelToTask(model) : null;
  }

  /**
   * すべてのタスクを取得（非同期版）
   */
  static async getAllTasks(): Promise<Task[]> {
    const models = await TaskRepository.findAll();
    return models.map((model) => this.modelToTask(model));
  }

  /**
   * 日付でタスクをフィルター（非同期版）
   */
  static async getTasksByDate(date: Date): Promise<Task[]> {
    const models = await TaskRepository.findByDate(date);
    return models.map((model) => this.modelToTask(model));
  }

  /**
   * カテゴリーでタスクをフィルター（非同期版）
   */
  static async getTasksByCategory(category: string): Promise<Task[]> {
    const models = await TaskRepository.findByCategory(category);
    return models.map((model) => this.modelToTask(model));
  }

  /**
   * ステータスでタスクをフィルター（非同期版）
   */
  static async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    const models = await TaskRepository.findByStatus(
      status as TaskSchema['status']
    );
    return models.map((model) => this.modelToTask(model));
  }

  /**
   * タスクを完了にする（非同期版）
   */
  static async completeTask(id: string): Promise<Task | null> {
    return await this.updateTask(id, {
      status: 'completed' as TaskStatus,
      completedAt: new Date(),
    });
  }

  /**
   * タスクの完了を取り消す（非同期版）
   */
  static async uncompleteTask(id: string): Promise<Task | null> {
    return await this.updateTask(id, {
      status: 'pending' as TaskStatus,
      completedAt: undefined,
    });
  }

  /**
   * タスクの優先度を変更（非同期版）
   */
  static async changePriority(
    id: string,
    priority: Priority
  ): Promise<Task | null> {
    return await this.updateTask(id, { priority });
  }

  /**
   * 期限切れのタスクを取得（非同期版）
   */
  static async getOverdueTasks(): Promise<Task[]> {
    const models = await TaskRepository.findOverdue();
    return models.map((model) => this.modelToTask(model));
  }

  /**
   * 今日のタスクを取得（非同期版）
   */
  static async getTodayTasks(): Promise<Task[]> {
    return await this.getTasksByDate(new Date());
  }

  /**
   * タスクの統計を取得（非同期版）
   */
  static async getTaskStatistics() {
    const stats = await TaskRepository.getStatistics();
    const todayTasks = await this.getTodayTasks();

    return {
      total: stats.total,
      completed: stats.completed,
      pending: stats.pending,
      overdue: stats.overdue,
      todayTotal: todayTasks.length,
      todayCompleted: todayTasks.filter((t) => t.status === 'completed').length,
    };
  }
}
