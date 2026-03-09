import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AppNavigator } from '../AppNavigator';
import { MainTabNavigator } from '../MainTabNavigator';

// Mock the screen components to avoid dependency issues
vi.mock('../../screens/calendar/CalendarScreen', () => ({
  CalendarScreen: () => <div>Calendar Screen</div>,
}));

vi.mock('../../screens/calendar/WeekViewScreen', () => ({
  WeekViewScreen: () => <div>Week View Screen</div>,
}));

vi.mock('../../screens/calendar/DayViewScreen', () => ({
  DayViewScreen: () => <div>Day View Screen</div>,
}));

vi.mock('../../screens/Statistics/StatisticsScreen', () => ({
  StatisticsScreen: () => <div>Statistics Screen</div>,
}));

vi.mock('../../screens/Settings/SettingsScreen', () => ({
  SettingsScreen: () => <div>Settings Screen</div>,
}));

vi.mock('../../screens/modals/TaskAddScreen', () => ({
  TaskAddScreen: () => <div>Task Add Screen</div>,
}));

vi.mock('../../screens/modals/TaskEditScreen', () => ({
  TaskEditScreen: () => <div>Task Edit Screen</div>,
}));

vi.mock('../../screens/modals/ReminderScreen', () => ({
  ReminderScreen: () => <div>Reminder Screen</div>,
}));

describe('AppNavigator', () => {
  it('レンダリングと初期ルートの表示', () => {
    render(
      <BrowserRouter>
        <AppNavigator />
      </BrowserRouter>
    );

    // デフォルトでカレンダー画面が表示される
    expect(screen.getByText('Calendar Screen')).toBeInTheDocument();
  });

  it('メインタブナビゲータが正しくレンダリングされる', () => {
    render(
      <BrowserRouter>
        <MainTabNavigator />
      </BrowserRouter>
    );

    // タブバーのリンクが存在することを確認
    expect(screen.getByText('カレンダー')).toBeInTheDocument();
    expect(screen.getByText('統計')).toBeInTheDocument();
    expect(screen.getByText('設定')).toBeInTheDocument();
  });

  it('タブ間のナビゲーションが正しく動作する', async () => {
    render(
      <BrowserRouter>
        <AppNavigator />
      </BrowserRouter>
    );

    // 初期状態はカレンダー画面
    expect(screen.getByText('Calendar Screen')).toBeInTheDocument();

    // 統計タブをクリック
    const statisticsTab = screen.getByText('統計');
    fireEvent.click(statisticsTab);

    // 統計画面に切り替わることを確認
    await waitFor(() => {
      expect(screen.getByText('Statistics Screen')).toBeInTheDocument();
    });

    // 設定タブをクリック
    const settingsTab = screen.getByText('設定');
    fireEvent.click(settingsTab);

    // 設定画面に切り替わることを確認
    await waitFor(() => {
      expect(screen.getByText('Settings Screen')).toBeInTheDocument();
    });

    // カレンダータブをクリックして元に戻る
    const calendarTab = screen.getByText('カレンダー');
    fireEvent.click(calendarTab);

    await waitFor(() => {
      expect(screen.getByText('Calendar Screen')).toBeInTheDocument();
    });
  });
});
