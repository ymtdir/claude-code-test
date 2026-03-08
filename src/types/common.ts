/**
 * 共通型定義
 */

// 基底エンティティ
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// 削除可能エンティティ
export interface DeletableEntity extends BaseEntity {
  deletedAt?: Date;
  isDeleted: boolean;
}

// ソート順
export type SortOrder = 'asc' | 'desc';

// ソート設定
export interface SortConfig {
  field: string;
  order: SortOrder;
}

// エラー型
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
  timestamp: Date;
}

// 検証エラー
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// 検証結果
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// 非同期操作の状態
export enum AsyncStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// 非同期状態
export interface AsyncState<T = unknown> {
  status: AsyncStatus;
  data?: T;
  error?: AppError;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

// ファイル情報
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  url?: string;
  base64?: string;
}

// 通知
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  actionLabel?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// 座標
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// 住所
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  formatted?: string;
}

// デバイス情報
export interface DeviceInfo {
  id: string;
  platform: 'ios' | 'android' | 'web';
  model?: string;
  osVersion?: string;
  appVersion?: string;
  pushToken?: string;
  lastActiveAt: Date;
}

// 設定項目
export interface SettingItem<T = unknown> {
  key: string;
  value: T;
  label: string;
  description?: string;
  type: 'boolean' | 'string' | 'number' | 'select' | 'multiselect';
  options?: Array<{ label: string; value: T }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// アプリ設定
export interface AppSettings {
  general: {
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    firstDayOfWeek: number;
    timezone: string;
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    taskReminders: boolean;
    dailySummary: boolean;
    weeklyReport: boolean;
  };
  sync: {
    autoSync: boolean;
    syncInterval: number; // minutes
    wifiOnly: boolean;
    backgroundSync: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    colorScheme: string;
  };
  privacy: {
    analytics: boolean;
    crashReporting: boolean;
    shareUsageData: boolean;
    locationTracking: boolean;
  };
}

// メタデータ
export interface Metadata {
  [key: string]: unknown;
}

// タイムスタンプ
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// 選択可能アイテム
export interface SelectableItem<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

// ツリー構造のノード
export interface TreeNode<T = unknown> {
  id: string;
  parentId?: string;
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
  selected?: boolean;
}

// キーバリューペア
export interface KeyValue<T = unknown> {
  key: string;
  value: T;
}

// 範囲
export interface Range<T = number> {
  min: T;
  max: T;
}

// 時間範囲
export interface TimeRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

// プログレス情報
export interface Progress {
  current: number;
  total: number;
  percentage: number;
  message?: string;
}

// アクション
export interface Action<T = unknown> {
  type: string;
  payload?: T;
  meta?: Metadata;
  error?: boolean;
}

// レスポンスステータス
export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}
