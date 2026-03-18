/**
 * リマインダー関連の型定義
 */

/**
 * リマインダーのタイプ
 */
export type ReminderType = 'time' | 'repeat';

/**
 * リマインダーの基本型
 */
export interface Reminder {
  id: string;
  taskId: string;
  type: ReminderType;
  timeOffset?: number; // 分単位（マイナスは事前通知）
  repeatRule?: RepeatRule;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 繰り返しルールの定義
 */
export interface RepeatRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval?: number; // カスタム間隔（日数）
  daysOfWeek?: number[]; // 0-6 (日-土)
  dayOfMonth?: number; // 1-31
  endDate?: Date; // 繰り返し終了日
}

/**
 * 通知オプションの拡張型
 */
export interface NotificationOptions extends globalThis.NotificationOptions {
  taskId?: string;
  reminderId?: string;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  timestamp?: number;
}

/**
 * 通知アクションの定義
 */
export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

/**
 * リマインダー設定のプリセット
 */
export const REMINDER_PRESETS = {
  ON_TIME: 0,
  FIVE_MINUTES_BEFORE: -5,
  TEN_MINUTES_BEFORE: -10,
  THIRTY_MINUTES_BEFORE: -30,
  ONE_HOUR_BEFORE: -60,
  ONE_DAY_BEFORE: -1440,
} as const;

/**
 * リマインダープリセットのタイプ
 */
export type ReminderPreset =
  (typeof REMINDER_PRESETS)[keyof typeof REMINDER_PRESETS];

/**
 * スヌーズオプション
 */
export const SNOOZE_OPTIONS = {
  FIVE_MINUTES: 5,
  TEN_MINUTES: 10,
  FIFTEEN_MINUTES: 15,
  THIRTY_MINUTES: 30,
  ONE_HOUR: 60,
} as const;

/**
 * スヌーズオプションのタイプ
 */
export type SnoozeOption = (typeof SNOOZE_OPTIONS)[keyof typeof SNOOZE_OPTIONS];

/**
 * 通知アクションタイプ
 */
export const NOTIFICATION_ACTIONS = {
  COMPLETE: 'complete',
  SNOOZE: 'snooze',
  DISMISS: 'dismiss',
  OPEN: 'open',
} as const;

/**
 * 通知アクションのタイプ
 */
export type NotificationActionType =
  (typeof NOTIFICATION_ACTIONS)[keyof typeof NOTIFICATION_ACTIONS];

/**
 * リマインダーのフィルター条件
 */
export interface ReminderFilter {
  taskId?: string;
  type?: Reminder['type'];
  isActive?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

/**
 * リマインダーの作成用DTO
 */
export interface CreateReminderDto {
  taskId: string;
  type: 'time' | 'repeat';
  timeOffset?: number;
  repeatRule?: RepeatRule;
}

/**
 * リマインダーの更新用DTO
 */
export interface UpdateReminderDto {
  id: string;
  timeOffset?: number;
  repeatRule?: RepeatRule;
  isActive?: boolean;
}
