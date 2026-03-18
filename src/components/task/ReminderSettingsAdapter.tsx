/**
 * ReminderSettingsAdapter
 * TaskFormと新しいReminderSettingsコンポーネントを繋ぐアダプタ
 */

import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ReminderSettings as NewReminderSettings } from '../ReminderSettings/ReminderSettings';
import {
  addReminder,
  deleteRemindersByTaskId,
  selectRemindersByTaskId,
} from '../../store/slices/reminderSlice';
import type { Reminder } from '../../types/task';
import type {
  CreateReminderDto,
  Reminder as NewReminderType,
} from '../../types/reminder';
import { v4 as uuidv4 } from 'uuid';

interface ReminderSettingsAdapterProps {
  taskId?: string;
  taskTitle?: string;
  taskDate?: Date;
  taskTime?: string;
  reminders: Partial<Reminder>[];
  onChange: (reminders: Partial<Reminder>[]) => void;
  disabled?: boolean;
}

export const ReminderSettingsAdapter: React.FC<
  ReminderSettingsAdapterProps
> = ({
  taskId,
  taskTitle = '新規タスク',
  taskDate,
  taskTime,
  reminders,
  onChange,
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const tempTaskId = taskId || `temp-${uuidv4()}`;

  // Reduxからリマインダーを取得
  const reduxReminders = useSelector(selectRemindersByTaskId(tempTaskId));

  // 初期化時にフォームのリマインダーをReduxに同期
  useEffect(() => {
    if (reminders.length > 0 && reduxReminders.length === 0) {
      reminders.forEach((reminder) => {
        const reminderData: CreateReminderDto = {
          taskId: tempTaskId,
          type:
            (reminder.type === 'location' ? 'time' : reminder.type) || 'time',
          timeOffset: reminder.timeOffset,
        };
        dispatch(addReminder(reminderData));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // リマインダー更新時のハンドラ
  const handleUpdate = useCallback(
    (updatedReminders: NewReminderType[]) => {
      // フォームの形式に変換
      const formReminders: Partial<Reminder>[] = updatedReminders.map(
        (reminder: NewReminderType) => {
          const baseReminder: Partial<Reminder> = {
            id: reminder.id,
            taskId: reminder.taskId,
            type: (reminder.type === 'repeat' ? 'time' : reminder.type) as
              | 'time'
              | 'location',
            timeOffset: reminder.timeOffset,
            isActive: reminder.isActive,
          };
          return baseReminder;
        }
      );
      onChange(formReminders);
    },
    [onChange]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      // 一時的なタスクIDの場合はクリーンアップ
      if (tempTaskId.startsWith('temp-')) {
        dispatch(deleteRemindersByTaskId(tempTaskId));
      }
    };
  }, [tempTaskId, dispatch]);

  return (
    <View
      style={disabled ? styles.disabledContainer : styles.container}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <NewReminderSettings
        taskId={tempTaskId}
        taskTitle={taskTitle}
        taskDate={taskDate}
        taskTime={taskTime}
        onUpdate={handleUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  disabledContainer: {
    marginVertical: 8,
    opacity: 0.5,
  },
});
