/**
 * Reminder Redux Slice
 * リマインダー機能の状態管理
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type {
  Reminder,
  CreateReminderDto,
  UpdateReminderDto,
  ReminderFilter,
} from '../../types/reminder';
import { v4 as uuidv4 } from 'uuid';

/**
 * リマインダー状態の定義
 */
interface ReminderState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  notificationPermission: NotificationPermission | null;
}

/**
 * 初期状態
 */
const initialState: ReminderState = {
  reminders: [],
  loading: false,
  error: null,
  notificationPermission: null,
};

/**
 * リマインダースライス
 */
const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    // リマインダーの追加
    addReminder: (state, action: PayloadAction<CreateReminderDto>) => {
      const newReminder: Reminder = {
        id: uuidv4(),
        ...action.payload,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.reminders.push(newReminder);
    },

    // リマインダーの更新
    updateReminder: (state, action: PayloadAction<UpdateReminderDto>) => {
      const index = state.reminders.findIndex(
        (r) => r.id === action.payload.id
      );
      if (index !== -1) {
        state.reminders[index] = {
          ...state.reminders[index],
          ...action.payload,
          updatedAt: new Date(),
        };
      }
    },

    // リマインダーの削除
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter((r) => r.id !== action.payload);
    },

    // タスクに関連するリマインダーを削除
    deleteRemindersByTaskId: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(
        (r) => r.taskId !== action.payload
      );
    },

    // リマインダーの有効/無効切り替え
    toggleReminder: (state, action: PayloadAction<string>) => {
      const reminder = state.reminders.find((r) => r.id === action.payload);
      if (reminder) {
        reminder.isActive = !reminder.isActive;
        reminder.updatedAt = new Date();
      }
    },

    // 複数のリマインダーを一括設定
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
    },

    // 通知権限の状態を設定
    setNotificationPermission: (
      state,
      action: PayloadAction<NotificationPermission>
    ) => {
      state.notificationPermission = action.payload;
    },

    // エラー状態の設定
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // ローディング状態の設定
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // 期限切れリマインダーの削除
    cleanupExpiredReminders: (state) => {
      state.reminders = state.reminders.filter((reminder) => {
        // 繰り返しリマインダーは削除しない
        if (reminder.type === 'repeat') {
          return true;
        }
        // 時間ベースのリマインダーで、過去のものは削除
        // ※実際のタスク日時と比較する必要があるが、ここでは簡略化
        return reminder.isActive;
      });
    },

    // 状態のリセット
    resetReminderState: (state) => {
      state.reminders = [];
      state.loading = false;
      state.error = null;
      state.notificationPermission = null;
    },
  },
});

// アクションのエクスポート
export const {
  addReminder,
  updateReminder,
  deleteReminder,
  deleteRemindersByTaskId,
  toggleReminder,
  setReminders,
  setNotificationPermission,
  setError,
  setLoading,
  cleanupExpiredReminders,
  resetReminderState,
} = reminderSlice.actions;

// セレクターのエクスポート
export const selectAllReminders = (state: RootState) =>
  state.reminder.reminders;

export const selectActiveReminders = (state: RootState) =>
  state.reminder.reminders.filter((r: Reminder) => r.isActive);

export const selectRemindersByTaskId = (taskId: string) => (state: RootState) =>
  state.reminder.reminders.filter((r: Reminder) => r.taskId === taskId);

export const selectReminderById = (id: string) => (state: RootState) =>
  state.reminder.reminders.find((r: Reminder) => r.id === id);

export const selectNotificationPermission = (state: RootState) =>
  state.reminder.notificationPermission;

export const selectReminderLoading = (state: RootState) =>
  state.reminder.loading;

export const selectReminderError = (state: RootState) => state.reminder.error;

// フィルター付きセレクター
export const selectRemindersWithFilter =
  (filter: ReminderFilter) => (state: RootState) => {
    let filtered = state.reminder.reminders;

    if (filter.taskId) {
      filtered = filtered.filter((r: Reminder) => r.taskId === filter.taskId);
    }
    if (filter.type) {
      filtered = filtered.filter((r: Reminder) => r.type === filter.type);
    }
    if (filter.isActive !== undefined) {
      filtered = filtered.filter(
        (r: Reminder) => r.isActive === filter.isActive
      );
    }

    return filtered;
  };

// リデューサーのエクスポート
export default reminderSlice.reducer;
