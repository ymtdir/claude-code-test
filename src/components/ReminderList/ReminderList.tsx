/**
 * ReminderList Component
 * アクティブなリマインダーのリスト表示
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveReminders,
  deleteReminder,
  toggleReminder,
  selectNotificationPermission,
  setNotificationPermission,
} from '../../store/slices/reminderSlice';
import { selectAllTasks } from '../../store/slices/tasksSlice';
import NotificationService from '../../services/NotificationService';
import type { Reminder } from '../../types/reminder';
import './ReminderList.css';

interface ReminderListProps {
  filterTaskId?: string;
  showInactive?: boolean;
  onReminderClick?: (reminder: Reminder) => void;
  className?: string;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  filterTaskId,
  showInactive = false,
  onReminderClick,
  className,
}) => {
  const dispatch = useDispatch();
  const activeReminders = useSelector(selectActiveReminders);
  const allTasks = useSelector(selectAllTasks);
  const notificationPermission = useSelector(selectNotificationPermission);

  // フィルタリングされたリマインダー
  const filteredReminders = useMemo(() => {
    let reminders = showInactive
      ? activeReminders
      : activeReminders.filter((r) => r.isActive);

    if (filterTaskId) {
      reminders = reminders.filter((r) => r.taskId === filterTaskId);
    }

    // タスク情報を付加
    return reminders.map((reminder) => {
      const task = allTasks.find((t) => t.id === reminder.taskId);
      return {
        ...reminder,
        taskTitle: task?.title || 'Unknown Task',
        taskDate: task?.date,
        taskTime: task?.time,
      };
    });
  }, [activeReminders, allTasks, filterTaskId, showInactive]);

  // グループ化されたリマインダー（タスクごと）
  const groupedReminders = useMemo(() => {
    const groups: { [key: string]: typeof filteredReminders } = {};

    filteredReminders.forEach((reminder) => {
      if (!groups[reminder.taskId]) {
        groups[reminder.taskId] = [];
      }
      groups[reminder.taskId].push(reminder);
    });

    return Object.entries(groups);
  }, [filteredReminders]);

  // 通知権限のリクエスト
  const handleRequestPermission = useCallback(async () => {
    const granted = await NotificationService.requestPermission();
    const permission = NotificationService.checkPermission();
    dispatch(setNotificationPermission(permission));

    if (granted) {
      NotificationService.showNotification('通知が有効になりました', {
        body: 'リマインダーの通知を受け取れるようになりました',
        icon: '/favicon.ico',
      });
    }
  }, [dispatch]);

  // リマインダーの削除
  const handleDeleteReminder = useCallback(
    (reminderId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(deleteReminder(reminderId));

      // スケジュールをキャンセル
      const reminder = filteredReminders.find((r) => r.id === reminderId);
      if (reminder) {
        NotificationService.cancelScheduledNotification(
          `${reminder.taskId}-${reminderId}`
        );
      }
    },
    [dispatch, filteredReminders]
  );

  // リマインダーの切り替え
  const handleToggleReminder = useCallback(
    (reminderId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleReminder(reminderId));

      const reminder = filteredReminders.find((r) => r.id === reminderId);
      if (reminder) {
        if (reminder.isActive) {
          // 無効化時はスケジュールをキャンセル
          NotificationService.cancelScheduledNotification(
            `${reminder.taskId}-${reminderId}`
          );
        } else {
          // 有効化時は再スケジュール
          if (reminder.taskDate) {
            const notificationTime = new Date(reminder.taskDate);
            if (reminder.taskTime) {
              const [hours, minutes] = reminder.taskTime.split(':').map(Number);
              notificationTime.setHours(hours, minutes, 0, 0);
            }

            notificationTime.setMinutes(
              notificationTime.getMinutes() + (reminder.timeOffset || 0)
            );

            const delay = notificationTime.getTime() - Date.now();

            if (delay > 0) {
              NotificationService.scheduleNotification(
                `${reminder.taskId}-${reminderId}`,
                reminder.taskTitle,
                {
                  body:
                    reminder.timeOffset === 0
                      ? 'タスクの時刻です'
                      : `${Math.abs(reminder.timeOffset || 0)}分後にタスクがあります`,
                  icon: '/favicon.ico',
                  tag: reminder.taskId,
                  requireInteraction: true,
                },
                delay
              );
            }
          }
        }
      }
    },
    [dispatch, filteredReminders]
  );

  // リマインダータイプの表示文字列を取得
  const getReminderTypeLabel = (reminder: Reminder) => {
    if (reminder.type === 'time') {
      if (reminder.timeOffset === 0) return '時刻通知';
      if ((reminder.timeOffset || 0) < 0) {
        return `${Math.abs(reminder.timeOffset || 0)}分前`;
      }
      return `${reminder.timeOffset}分後`;
    }

    if (reminder.type === 'repeat' && reminder.repeatRule) {
      switch (reminder.repeatRule.frequency) {
        case 'daily':
          return '毎日';
        case 'weekly':
          return '毎週';
        case 'monthly':
          return '毎月';
        case 'custom':
          return `${reminder.repeatRule.interval}日ごと`;
        default:
          return '繰り返し';
      }
    }

    return 'カスタム';
  };

  // 次回通知時刻の計算
  const getNextNotificationTime = (
    reminder: Reminder & { taskDate?: Date; taskTime?: string }
  ) => {
    if (!reminder.taskDate) return null;

    const notificationTime = new Date(reminder.taskDate);
    if (reminder.taskTime) {
      const [hours, minutes] = reminder.taskTime.split(':').map(Number);
      notificationTime.setHours(hours, minutes, 0, 0);
    }

    notificationTime.setMinutes(
      notificationTime.getMinutes() + (reminder.timeOffset || 0)
    );

    return notificationTime;
  };

  // 時刻のフォーマット
  const formatTime = (date: Date | null) => {
    if (!date) return '-';

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    if (diffMs < 0) return '期限切れ';

    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}日後`;
    }
    if (diffHours > 0) {
      return `${diffHours}時間後`;
    }
    return `${diffMinutes}分後`;
  };

  if (notificationPermission !== 'granted') {
    return (
      <div className={`reminder-list-container ${className || ''}`}>
        <div className="permission-required">
          <div className="permission-icon">🔔</div>
          <h3>通知を有効にしてください</h3>
          <p>
            リマインダー機能を使用するには、ブラウザの通知を許可する必要があります。
          </p>
          <button className="enable-button" onClick={handleRequestPermission}>
            通知を許可する
          </button>
        </div>
      </div>
    );
  }

  if (filteredReminders.length === 0) {
    return (
      <div className={`reminder-list-container ${className || ''}`}>
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>リマインダーがありません</h3>
          <p>
            {filterTaskId
              ? 'このタスクにはリマインダーが設定されていません'
              : 'タスクにリマインダーを設定すると、ここに表示されます'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`reminder-list-container ${className || ''}`}>
      <div className="reminder-groups">
        {groupedReminders.map(([taskId, reminders]) => (
          <div key={taskId} className="reminder-group">
            <div className="group-header">
              <h3 className="task-title">{reminders[0].taskTitle}</h3>
              <span className="reminder-count">{reminders.length}件</span>
            </div>

            <div className="reminders">
              {reminders.map((reminder) => {
                const nextTime = getNextNotificationTime(reminder);
                const isExpired = nextTime && nextTime.getTime() < Date.now();

                return (
                  <div
                    key={reminder.id}
                    className={`reminder-card ${reminder.isActive ? 'active' : 'inactive'} ${isExpired ? 'expired' : ''}`}
                    onClick={() => onReminderClick?.(reminder)}
                  >
                    <div className="reminder-info">
                      <div className="reminder-type">
                        <span className="type-icon">
                          {reminder.type === 'repeat' ? '🔁' : '⏰'}
                        </span>
                        <span className="type-label">
                          {getReminderTypeLabel(reminder)}
                        </span>
                      </div>

                      <div className="reminder-time">
                        <span className="time-label">次回通知:</span>
                        <span className="time-value">
                          {formatTime(nextTime)}
                        </span>
                      </div>
                    </div>

                    <div className="reminder-actions">
                      <button
                        className={`toggle-button ${reminder.isActive ? 'active' : ''}`}
                        onClick={(e) => handleToggleReminder(reminder.id, e)}
                        aria-label={reminder.isActive ? '無効化' : '有効化'}
                      >
                        <span className="toggle-icon">
                          {reminder.isActive ? '🔔' : '🔕'}
                        </span>
                      </button>

                      <button
                        className="delete-button"
                        onClick={(e) => handleDeleteReminder(reminder.id, e)}
                        aria-label="削除"
                      >
                        <span className="delete-icon">×</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderList;
