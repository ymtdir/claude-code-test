/**
 * ナビゲーション型定義
 */

// ルートスタックのパラメータ型
export type RootStackParamList = {
  Main: undefined;
  TaskAdd: { date?: string };
  TaskEdit: { taskId: string };
  Reminder: { taskId: string };
};

// メインタブのパラメータ型
export type MainTabParamList = {
  Calendar: undefined;
  Statistics: undefined;
  Settings: undefined;
};

// カレンダースタックのパラメータ型
export type CalendarStackParamList = {
  CalendarMain: undefined;
  MonthView: { year: number; month: number };
  WeekView: { startDate: string };
  DayView: { date: string };
};

// 統計スタックのパラメータ型
export type StatisticsStackParamList = {
  StatisticsMain: undefined;
  ChartView: { type: 'daily' | 'weekly' | 'monthly' };
  Report: { startDate: string; endDate: string };
};

// 設定スタックのパラメータ型
export type SettingsStackParamList = {
  SettingsMain: undefined;
  Profile: undefined;
  Notifications: undefined;
  Theme: undefined;
  About: undefined;
};

// 画面プロップスの型定義用のユーティリティ型
export type ScreenProps<T extends Record<string, any>, K extends keyof T> = {
  route?: {
    params?: T[K];
  };
  navigation?: any; // React Routerでは使用しないが、互換性のため定義
};

// タスクの型定義（仮）
export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  reminder?: Date;
}

// ユーザーの型定義（仮）
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// テーマの型定義
export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

// 通知設定の型定義
export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  taskReminder: boolean;
  reminderTime?: string;
}

// チャートデータの型定義
export interface ChartData {
  label: string;
  value: number;
  date: string;
}

// 統計サマリーの型定義
export interface StatisticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  streak: number;
}
