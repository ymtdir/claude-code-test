/**
 * テストデータファクトリー
 * 一貫性のあるモックデータを生成
 */

import type { Task, Category, Priority, TaskStatus } from '../types/task';
import type { Reminder } from '../types/reminder';

/**
 * モックタスクを生成
 */
export const mockTask = (overrides?: Partial<Task>): Task => {
  const now = new Date('2026-03-19T10:00:00Z');

  return {
    id: 'test-task-1',
    title: 'Test Task',
    category: '仕事' as Category,
    date: now,
    time: '10:00',
    priority: 'medium' as Priority,
    status: 'pending' as TaskStatus,
    note: 'Test note',
    reminders: [],
    sharedWith: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * 複数のモックタスクを生成
 */
export const mockTaskList = (count: number): Task[] =>
  Array.from({ length: count }, (_, i) =>
    mockTask({
      id: `test-task-${i + 1}`,
      title: `Task ${i + 1}`,
      priority: ['low', 'medium', 'high'][i % 3] as Priority,
    })
  );

/**
 * 完了済みタスクを生成
 */
export const mockCompletedTask = (overrides?: Partial<Task>): Task =>
  mockTask({
    status: 'completed' as TaskStatus,
    completedAt: new Date('2026-03-19T12:00:00Z'),
    ...overrides,
  });

/**
 * 高優先度タスクを生成
 */
export const mockHighPriorityTask = (overrides?: Partial<Task>): Task =>
  mockTask({
    priority: 'high' as Priority,
    ...overrides,
  });

/**
 * モックリマインダーを生成
 */
export const mockReminder = (overrides?: Partial<Reminder>): Reminder => {
  const now = new Date('2026-03-19T10:00:00Z');

  return {
    id: 'test-reminder-1',
    taskId: 'test-task-1',
    type: 'time',
    timeOffset: 15, // 15分前
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * カテゴリー別のタスクを生成
 */
export const mockTasksByCategory = (
  category: Category,
  count: number = 3
): Task[] =>
  Array.from({ length: count }, (_, i) =>
    mockTask({
      id: `test-${category}-${i + 1}`,
      title: `${category} Task ${i + 1}`,
      category,
    })
  );

/**
 * 日付範囲のタスクを生成
 */
export const mockTasksInDateRange = (
  startDate: Date,
  endDate: Date
): Task[] => {
  const tasks: Task[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    tasks.push(
      mockTask({
        id: `test-task-${currentDate.toISOString()}`,
        title: `Task for ${currentDate.toLocaleDateString()}`,
        date: new Date(currentDate),
      })
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return tasks;
};

/**
 * ステータス別のタスクリストを生成
 */
export const mockTasksByStatus = (
  status: TaskStatus,
  count: number = 3
): Task[] =>
  Array.from({ length: count }, (_, i) =>
    mockTask({
      id: `test-${status}-${i + 1}`,
      status,
      ...(status === 'completed' && {
        completedAt: new Date('2026-03-19T12:00:00Z'),
      }),
    })
  );
