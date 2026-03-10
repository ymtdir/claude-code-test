import React, { useState, useCallback, useMemo } from 'react';
import './MonthViewScreen.css';
import {
  getTasksByDate,
  updateTaskCompletion,
  // getTaskCountByDate, // 将来CalendarGridで使用予定
  // postponeTask, // スワイプジェスチャー実装時に使用予定
} from '../../mocks/taskData';

/**
 * カレンダー月表示画面
 * UnifiedCalのメイン画面として、カレンダーとタスクリストを統合表示
 */
export const MonthViewScreen: React.FC = () => {
  // 選択中の日付（YYYY-MM-DD形式）
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // 表示月
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());

  // 選択日のタスク
  const selectedDateTasks = useMemo(
    () => getTasksByDate(selectedDate),
    [selectedDate]
  );

  // タスク数マップ（将来CalendarGridで使用）
  // 現在は未使用のため、必要になった時に実装
  // const taskCountMap = useMemo(() => getTaskCountByDate(), []);

  // 完了タスク数
  const completedCount = useMemo(
    () => selectedDateTasks.filter((task) => task.completed).length,
    [selectedDateTasks]
  );

  // 完了率
  const completionRate = useMemo(() => {
    if (selectedDateTasks.length === 0) return 0;
    return Math.round((completedCount / selectedDateTasks.length) * 100);
  }, [completedCount, selectedDateTasks.length]);

  // 日付選択ハンドラ（CalendarGridで使用予定）
  // 現在は未使用のため、必要になった時に実装
  // const handleDateSelect = useCallback((date: string) => {
  //   setSelectedDate(date);
  // }, []);

  // 月変更ハンドラ
  const handleMonthChange = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  }, []);

  // タスク完了ハンドラ
  const handleTaskComplete = useCallback(
    (taskId: string) => {
      const task = selectedDateTasks.find((t) => t.id === taskId);
      if (task) {
        updateTaskCompletion(taskId, !task.completed);
        // 状態を更新（実際のアプリではReduxなどで管理）
        setSelectedDate((prev) => prev); // 再レンダリングをトリガー
      }
    },
    [selectedDateTasks]
  );

  // タスク延期ハンドラ（スワイプジェスチャーで使用予定）
  // 現在は未使用のため、必要になった時に実装
  // const handleTaskPostpone = useCallback((taskId: string) => {
  //   postponeTask(taskId);
  //   // 状態を更新（実際のアプリではReduxなどで管理）
  //   setSelectedDate((prev) => prev); // 再レンダリングをトリガー
  // }, []);

  // 月のフォーマット
  const monthYearString = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return `${year}年${month}月`;
  }, [currentMonth]);

  return (
    <div className="month-view-container">
      {/* ヘッダー */}
      <div className="month-view-header">
        <h1 className="header-title">UnifiedCal</h1>
        <div className="header-icons">{/* アイコンプレースホルダー */}</div>
      </div>

      {/* 月選択 */}
      <div className="month-selector">
        <button
          className="month-arrow"
          onClick={() => handleMonthChange('prev')}
        >
          {'＜'}
        </button>
        <span className="month-text">{monthYearString}</span>
        <button
          className="month-arrow"
          onClick={() => handleMonthChange('next')}
        >
          {'＞'}
        </button>
      </div>

      {/* カレンダーグリッド - プレースホルダー */}
      <div className="calendar-container">
        <div className="placeholder-text">
          カレンダーグリッドがここに表示されます
        </div>
        <div className="debug-info">
          選択日: {selectedDate} | タスク数: {selectedDateTasks.length}
        </div>
      </div>

      {/* プログレスバー */}
      <div className="progress-container">
        <div className="progress-text">
          今日のタスク ({completedCount}/{selectedDateTasks.length}完了)
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="progress-percent">{completionRate}%</div>
      </div>

      {/* タスクリスト */}
      <div className="task-list-container">
        {selectedDateTasks.map((task) => (
          <div
            key={task.id}
            className="task-item"
            onClick={() => handleTaskComplete(task.id)}
          >
            <div className="task-checkbox">
              {task.completed && <span className="checkmark">✓</span>}
            </div>
            <div className="task-content">
              <span
                className={`task-title ${
                  task.completed ? 'task-title-completed' : ''
                }`}
              >
                {task.title}
              </span>
              {task.time && <span className="task-time">{task.time}</span>}
            </div>
          </div>
        ))}
        {selectedDateTasks.length === 0 && (
          <div className="empty-task-text">タスクがありません</div>
        )}
      </div>

      {/* タスク追加ボタン */}
      <button className="add-task-button">
        <span className="add-task-button-text">＋ タスクを追加</span>
      </button>
    </div>
  );
};
