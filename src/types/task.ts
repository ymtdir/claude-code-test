/**
 * タスク関連の型定義
 */

// タスクステータス
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  CANCELLED = 'cancelled',
}

// タスク優先度
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// 繰り返しタイプ
export enum RepeatType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

// カテゴリー
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// リマインダー
export interface Reminder {
  id: string;
  taskId: string;
  type: 'time' | 'location';
  triggerTime?: Date;
  triggerLocation?: Location;
  message?: string;
  isActive: boolean;
  createdAt: Date;
}

// 位置情報
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
}

// 添付ファイル
export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// 繰り返し設定
export interface RepeatRule {
  type: RepeatType;
  interval: number; // 繰り返し間隔
  daysOfWeek?: number[]; // 曜日指定 (0=日曜, 6=土曜)
  dayOfMonth?: number; // 月の日付指定
  endDate?: Date; // 終了日
  occurrences?: number; // 繰り返し回数
}

// サブタスク
export interface SubTask {
  id: string;
  parentTaskId: string;
  title: string;
  isCompleted: boolean;
  order: number;
  createdAt: Date;
  completedAt?: Date;
}

// タスクのメインインターフェース
export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  category?: Category;
  date: Date;
  time?: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  reminders: Reminder[];
  repeatRule?: RepeatRule;
  sharedWith: string[];
  attachments: Attachment[];
  location?: Location;
  subTasks: SubTask[];
  tags: string[];
  estimatedDuration?: number; // 分単位
  actualDuration?: number; // 分単位
  completedAt?: Date;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: SyncStatus;
}

// 同期ステータス
export interface SyncStatus {
  lastSyncAt?: Date;
  pendingChanges: boolean;
  version: number;
  conflictResolution?: 'local' | 'remote' | 'manual';
}

// タスク作成用の入力型
export interface TaskInput {
  title: string;
  description?: string;
  categoryId?: string;
  date: Date;
  time?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  reminders?: Omit<Reminder, 'id' | 'taskId' | 'createdAt'>[];
  repeatRule?: RepeatRule;
  location?: Location;
  tags?: string[];
  estimatedDuration?: number;
  assignedTo?: string;
}

// タスク更新用の入力型
export type TaskUpdateInput = Partial<TaskInput> & {
  status?: TaskStatus;
  subTasks?: Omit<SubTask, 'id' | 'parentTaskId' | 'createdAt'>[];
};

// タスクフィルター
export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  categoryIds?: string[];
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  assignedTo?: string;
  createdBy?: string;
  searchText?: string;
}

// 日別タスク統計
export interface DailyTaskStats {
  date: Date;
  created: number;
  completed: number;
  pending: number;
}

// タスク統計
export interface TaskStatistics {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
  averageDuration: number;
  byPriority: Record<TaskPriority, number>;
  byCategory: Record<string, number>;
  dailyStats: DailyTaskStats[];
}
