import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainTabNavigator } from './MainTabNavigator';

// 画面コンポーネントの動的インポート（コード分割）
const CalendarScreen = lazy(() =>
  import('../screens/calendar/CalendarScreen').then((module) => ({
    default: module.CalendarScreen,
  }))
);
const MonthViewScreen = lazy(() =>
  import('../screens/calendar/MonthViewScreen').then((module) => ({
    default: module.MonthViewScreen,
  }))
);
const WeekViewScreen = lazy(() =>
  import('../screens/calendar/WeekViewScreen').then((module) => ({
    default: module.WeekViewScreen,
  }))
);
const DayViewScreen = lazy(() =>
  import('../screens/calendar/DayViewScreen').then((module) => ({
    default: module.DayViewScreen,
  }))
);
const StatisticsScreen = lazy(() =>
  import('../screens/Statistics/StatisticsScreen').then((module) => ({
    default: module.StatisticsScreen,
  }))
);
const SettingsScreen = lazy(() =>
  import('../screens/Settings/SettingsScreen').then((module) => ({
    default: module.SettingsScreen,
  }))
);
// Issue #20で実装したタスク画面
const TaskAddScreen = lazy(() =>
  import('../screens/Task/TaskAddScreen').then((module) => ({
    default: module.TaskAddScreen,
  }))
);
const TaskEditScreen = lazy(() =>
  import('../screens/Task/TaskEditScreen').then((module) => ({
    default: module.TaskEditScreen,
  }))
);
const ReminderScreen = lazy(() =>
  import('../screens/modals/ReminderScreen').then((module) => ({
    default: module.ReminderScreen,
  }))
);

/**
 * ローディングコンポーネント
 */
const Loading: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <p>Loading...</p>
  </div>
);

/**
 * アプリケーションのルートナビゲーター
 * すべてのルーティングを管理
 */
export const AppNavigator: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
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
    </Suspense>
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
