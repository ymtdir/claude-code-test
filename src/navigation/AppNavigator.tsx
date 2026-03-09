import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainTabNavigator } from './MainTabNavigator';

// 画面コンポーネントのインポート
import { CalendarScreen } from '../screens/calendar/CalendarScreen';
import { MonthViewScreen } from '../screens/calendar/MonthViewScreen';
import { WeekViewScreen } from '../screens/calendar/WeekViewScreen';
import { DayViewScreen } from '../screens/calendar/DayViewScreen';
import { StatisticsScreen } from '../screens/statistics/StatisticsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { TaskAddScreen } from '../screens/modals/TaskAddScreen';
import { TaskEditScreen } from '../screens/modals/TaskEditScreen';
import { ReminderScreen } from '../screens/modals/ReminderScreen';

/**
 * アプリケーションのルートナビゲーター
 * すべてのルーティングを管理
 */
export const AppNavigator: React.FC = () => {
  return (
    <Routes>
      {/* メインタブレイアウト */}
      <Route path="/" element={<MainTabNavigator />}>
        <Route index element={<Navigate to="/calendar" replace />} />
        <Route path="calendar" element={<CalendarScreen />} />
        <Route path="statistics" element={<StatisticsScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
      </Route>

      {/* カレンダー関連の詳細画面 */}
      <Route path="/calendar/month" element={<MonthViewScreen />} />
      <Route path="/calendar/week" element={<WeekViewScreen />} />
      <Route path="/calendar/day" element={<DayViewScreen />} />

      {/* モーダル画面 */}
      <Route path="/task/add" element={<TaskAddScreen />} />
      <Route path="/task/edit/:taskId" element={<TaskEditScreen />} />
      <Route path="/reminder/:taskId" element={<ReminderScreen />} />

      {/* 404ページ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * 404ページコンポーネント
 */
const NotFound: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>
        ページが見つかりませんでした
      </p>
      <a
        href="/"
        style={{
          padding: '12px 24px',
          background: '#1976d2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        ホームに戻る
      </a>
    </div>
  );
};
