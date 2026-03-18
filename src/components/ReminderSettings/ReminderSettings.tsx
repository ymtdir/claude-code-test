/**
 * ReminderSettings Component
 * タスクのリマインダー設定UI
 */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  addReminder,
  deleteReminder,
  toggleReminder,
  selectRemindersByTaskId,
  setNotificationPermission,
  selectNotificationPermission,
} from '../../store/slices/reminderSlice';
import NotificationService from '../../services/NotificationService';
import {
  REMINDER_PRESETS,
  type Reminder,
  type CreateReminderDto,
} from '../../types/reminder';
import './ReminderSettings.css';

interface ReminderSettingsProps {
  taskId: string;
  taskTitle: string;
  taskDate?: Date;
  taskTime?: string;
  onUpdate?: (reminders: Reminder[]) => void;
}

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  taskId,
  taskTitle,
  taskDate,
  taskTime,
  onUpdate,
}) => {
  const dispatch = useDispatch();
  const reminders = useSelector(selectRemindersByTaskId(taskId));
  const notificationPermission = useSelector(selectNotificationPermission);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);

  // 通知権限のリクエスト
  const handleRequestPermission = useCallback(async () => {
    const granted = await NotificationService.requestPermission();
    const permission = NotificationService.checkPermission();
    dispatch(setNotificationPermission(permission));

    if (granted) {
      NotificationService.showNotification('通知が有効になりました', {
        body: 'リマインダー機能が利用可能です',
        icon: '/favicon.ico',
      });
    }
  }, [dispatch]);

  // 時刻通知の追加
  const handleAddTimeReminder = useCallback(
    (timeOffset: number) => {
      const reminderData: CreateReminderDto = {
        taskId,
        type: 'time',
        timeOffset,
      };

      dispatch(addReminder(reminderData));

      // 通知をスケジュール
      if (taskDate) {
        const notificationTime = new Date(taskDate);
        if (taskTime) {
          const [hours, minutes] = taskTime.split(':').map(Number);
          notificationTime.setHours(hours, minutes, 0, 0);
        }

        // オフセットを適用
        notificationTime.setMinutes(notificationTime.getMinutes() + timeOffset);

        const delay = notificationTime.getTime() - Date.now();

        if (delay > 0) {
          const notificationId = `${taskId}-${uuidv4()}`;
          NotificationService.scheduleNotification(
            notificationId,
            timeOffset === 0
              ? taskTitle
              : `${taskTitle} (${Math.abs(timeOffset)}分前)`,
            {
              body:
                timeOffset === 0
                  ? 'タスクの時刻です'
                  : `${Math.abs(timeOffset)}分後にタスクがあります`,
              icon: '/favicon.ico',
              tag: taskId,
              requireInteraction: true,
            },
            delay
          );
        }
      }

      if (onUpdate) {
        onUpdate(reminders);
      }
    },
    [taskId, taskTitle, taskDate, taskTime, reminders, dispatch, onUpdate]
  );

  // リマインダーの削除
  const handleDeleteReminder = useCallback(
    (reminderId: string) => {
      dispatch(deleteReminder(reminderId));

      // スケジュールをキャンセル
      NotificationService.cancelScheduledNotification(
        `${taskId}-${reminderId}`
      );

      if (onUpdate) {
        onUpdate(reminders.filter((r: Reminder) => r.id !== reminderId));
      }
    },
    [taskId, reminders, dispatch, onUpdate]
  );

  // リマインダーの切り替え
  const handleToggleReminder = useCallback(
    (reminderId: string) => {
      dispatch(toggleReminder(reminderId));

      const reminder = reminders.find((r: Reminder) => r.id === reminderId);
      if (reminder) {
        if (reminder.isActive) {
          NotificationService.cancelScheduledNotification(
            `${taskId}-${reminderId}`
          );
        } else {
          // 再スケジュール
          handleAddTimeReminder(reminder.timeOffset || 0);
        }
      }

      if (onUpdate) {
        onUpdate(reminders);
      }
    },
    [taskId, reminders, dispatch, onUpdate, handleAddTimeReminder]
  );

  // プリセットボタンのレンダリング
  const renderPresetButton = (label: string, offset: number) => {
    const isActive = reminders.some(
      (r: Reminder) => r.timeOffset === offset && r.isActive
    );

    return (
      <button
        key={offset}
        className={`preset-button ${isActive ? 'active' : ''}`}
        onClick={() => handleAddTimeReminder(offset)}
        disabled={isActive}
        aria-label={label}
      >
        {label}
        {isActive && <span className="check-mark">✓</span>}
      </button>
    );
  };

  return (
    <div className="reminder-settings">
      <h3 className="reminder-title">
        <span className="icon">🔔</span>
        リマインダー設定
      </h3>

      {/* 通知権限の確認 */}
      {notificationPermission !== 'granted' && (
        <div className="permission-banner">
          <p>通知を受け取るには権限が必要です</p>
          <button
            className="permission-button"
            onClick={handleRequestPermission}
          >
            通知を許可
          </button>
        </div>
      )}

      {/* 事前通知プリセット */}
      <div className="preset-section">
        <h4>事前通知</h4>
        <div className="preset-buttons">
          {renderPresetButton('時刻通知', REMINDER_PRESETS.ON_TIME)}
          {renderPresetButton('10分前', REMINDER_PRESETS.TEN_MINUTES_BEFORE)}
          {renderPresetButton('30分前', REMINDER_PRESETS.THIRTY_MINUTES_BEFORE)}
          {renderPresetButton('1時間前', REMINDER_PRESETS.ONE_HOUR_BEFORE)}
        </div>
      </div>

      {/* 繰り返し設定 */}
      <div className="repeat-section">
        <button
          className="repeat-toggle"
          onClick={() => setShowRepeatOptions(!showRepeatOptions)}
        >
          <span className="icon">🔁</span>
          繰り返し設定
          <span className={`arrow ${showRepeatOptions ? 'open' : ''}`}>▼</span>
        </button>

        {showRepeatOptions && (
          <div className="repeat-options">
            <label>
              <input type="radio" name="repeat" value="daily" />
              毎日
            </label>
            <label>
              <input type="radio" name="repeat" value="weekly" />
              毎週
            </label>
            <label>
              <input type="radio" name="repeat" value="monthly" />
              毎月
            </label>
          </div>
        )}
      </div>

      {/* アクティブなリマインダー */}
      {reminders.length > 0 && (
        <div className="active-reminders">
          <h4>設定中のリマインダー</h4>
          <ul className="reminder-list">
            {reminders.map((reminder: Reminder) => (
              <li key={reminder.id} className="reminder-item">
                <input
                  type="checkbox"
                  checked={reminder.isActive}
                  onChange={() => handleToggleReminder(reminder.id)}
                />
                <span className="reminder-label">
                  {reminder.timeOffset === 0
                    ? '時刻通知'
                    : `${Math.abs(reminder.timeOffset || 0)}分前`}
                </span>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteReminder(reminder.id)}
                  aria-label="削除"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReminderSettings;
