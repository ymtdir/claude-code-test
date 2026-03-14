/**
 * LocalStorageからIndexedDBへのマイグレーションユーティリティ
 */

import { TaskRepository } from '../repositories';
import type { TaskSchema } from '../database/schema';
import type { Task } from '../types/task';

const MIGRATION_KEY = 'db_migration_completed';
const TASKS_STORAGE_KEY = 'unified_cal_tasks';

export class DatabaseMigration {
  /**
   * マイグレーションが完了しているか確認
   */
  static isMigrationCompleted(): boolean {
    return localStorage.getItem(MIGRATION_KEY) === 'true';
  }

  /**
   * マイグレーションを完了としてマーク
   */
  private static markMigrationCompleted(): void {
    localStorage.setItem(MIGRATION_KEY, 'true');
  }

  /**
   * LocalStorageからタスクデータを取得
   */
  private static getTasksFromLocalStorage(): Task[] {
    try {
      const storedData = localStorage.getItem(TASKS_STORAGE_KEY);
      if (!storedData) return [];

      const tasks = JSON.parse(storedData);

      // 日付文字列をDateオブジェクトに変換
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return tasks.map((task: any) => ({
        ...task,
        date: task.date ? new Date(task.date) : new Date(),
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      console.error('Failed to parse tasks from LocalStorage:', error);
      return [];
    }
  }

  /**
   * タスクをIndexedDBに移行
   */
  private static async migrateTasksToDatabase(tasks: Task[]): Promise<number> {
    let migratedCount = 0;

    for (const task of tasks) {
      try {
        const taskSchema: Partial<TaskSchema> = {
          id: task.id,
          title: task.title || '',
          category: task.category || 'work',
          date: task.date,
          time: task.time,
          priority: task.priority || 'medium',
          status: (task.status || 'pending') as TaskSchema['status'],
          note: task.note,
          completedAt: task.completedAt,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };

        await TaskRepository.create(taskSchema);
        migratedCount++;
      } catch (error) {
        console.error(`Failed to migrate task ${task.id}:`, error);
      }
    }

    return migratedCount;
  }

  /**
   * LocalStorage内の古いデータをクリーンアップ
   * 注意: このメソッドは破壊的な操作です。実行前にバックアップを取ることを推奨します。
   */
  static cleanupLocalStorage(): void {
    // タスクデータを削除
    localStorage.removeItem(TASKS_STORAGE_KEY);

    // その他の関連データも削除
    const keysToRemove = [
      'unified_cal_categories',
      'unified_cal_settings',
      'unified_cal_reminders',
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  /**
   * データベースマイグレーションを実行
   */
  static async runMigration(): Promise<{
    success: boolean;
    migratedCount: number;
    error?: string;
  }> {
    // 既にマイグレーション済みの場合はスキップ
    if (this.isMigrationCompleted()) {
      console.log('Migration already completed');
      return { success: true, migratedCount: 0 };
    }

    try {
      console.log('Starting database migration...');

      // LocalStorageからタスクを取得
      const tasks = this.getTasksFromLocalStorage();
      console.log(`Found ${tasks.length} tasks in LocalStorage`);

      if (tasks.length === 0) {
        // タスクがない場合もマイグレーション完了としてマーク
        this.markMigrationCompleted();
        return { success: true, migratedCount: 0 };
      }

      // IndexedDBにタスクを移行
      const migratedCount = await this.migrateTasksToDatabase(tasks);
      console.log(
        `Successfully migrated ${migratedCount}/${tasks.length} tasks`
      );

      // マイグレーション完了をマーク
      this.markMigrationCompleted();

      // 古いデータをクリーンアップ（オプション）
      // コメントアウトを解除して実行する場合は、バックアップを取ることを推奨
      // this.cleanupLocalStorage();

      return {
        success: true,
        migratedCount,
      };
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        migratedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * マイグレーションステータスを取得
   */
  static getMigrationStatus(): {
    migrated: boolean;
    localStorageTaskCount: number;
    hasLegacyData: boolean;
  } {
    const migrated = this.isMigrationCompleted();
    const tasks = this.getTasksFromLocalStorage();
    const hasLegacyData =
      tasks.length > 0 || localStorage.getItem(TASKS_STORAGE_KEY) !== null;

    return {
      migrated,
      localStorageTaskCount: tasks.length,
      hasLegacyData,
    };
  }

  /**
   * マイグレーションをリセット（デバッグ用）
   */
  static resetMigration(): void {
    localStorage.removeItem(MIGRATION_KEY);
    console.log(
      'Migration status reset. Next app launch will attempt migration.'
    );
  }
}
