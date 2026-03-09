import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppNavigator } from '../AppNavigator';

// Mock all screen components
vi.mock('../../screens/calendar/CalendarScreen', () => ({
  CalendarScreen: () => (
    <div data-testid="calendar-screen">Calendar Screen</div>
  ),
}));

vi.mock('../../screens/calendar/WeekViewScreen', () => ({
  WeekViewScreen: () => (
    <div data-testid="week-view-screen">Week View Screen</div>
  ),
}));

vi.mock('../../screens/calendar/DayViewScreen', () => ({
  DayViewScreen: () => <div data-testid="day-view-screen">Day View Screen</div>,
}));

vi.mock('../../screens/Statistics/StatisticsScreen', () => ({
  StatisticsScreen: () => (
    <div data-testid="statistics-screen">Statistics Screen</div>
  ),
}));

vi.mock('../../screens/Settings/SettingsScreen', () => ({
  SettingsScreen: () => (
    <div data-testid="settings-screen">Settings Screen</div>
  ),
}));

vi.mock('../../screens/modals/TaskAddScreen', () => ({
  TaskAddScreen: () => <div data-testid="task-add-screen">Task Add Screen</div>,
}));

vi.mock('../../screens/modals/TaskEditScreen', () => ({
  TaskEditScreen: () => (
    <div data-testid="task-edit-screen">Task Edit Screen</div>
  ),
}));

vi.mock('../../screens/modals/ReminderScreen', () => ({
  ReminderScreen: () => (
    <div data-testid="reminder-screen">Reminder Screen</div>
  ),
}));

describe('Navigation Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('週表示画面へのナビゲーションが正しく動作する', async () => {
    render(
      <MemoryRouter initialEntries={['/calendar/week']}>
        <AppNavigator />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('week-view-screen')).toBeInTheDocument();
    });
  });

  it('日表示画面へのナビゲーションが正しく動作する', async () => {
    render(
      <MemoryRouter initialEntries={['/calendar/day']}>
        <AppNavigator />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('day-view-screen')).toBeInTheDocument();
    });
  });

  it('タスク追加モーダルへのナビゲーションが正しく動作する', async () => {
    render(
      <MemoryRouter initialEntries={['/task/add']}>
        <AppNavigator />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-add-screen')).toBeInTheDocument();
    });
  });

  it('タスク編集モーダルへのナビゲーションが正しく動作する', async () => {
    render(
      <MemoryRouter initialEntries={['/task/edit/1']}>
        <AppNavigator />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-edit-screen')).toBeInTheDocument();
    });
  });

  it('リマインダー設定モーダルへのナビゲーションが正しく動作する', async () => {
    render(
      <MemoryRouter initialEntries={['/reminder/1']}>
        <AppNavigator />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('reminder-screen')).toBeInTheDocument();
    });
  });

  it('不正なパスの場合、404ページが表示される', async () => {
    render(
      <MemoryRouter initialEntries={['/invalid/path']}>
        <AppNavigator />
      </MemoryRouter>
    );

    // 404ページが表示される
    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(
        screen.getByText('ページが見つかりませんでした')
      ).toBeInTheDocument();
    });
  });

  it('統計画面への直接アクセスが正しく動作する', async () => {
    render(
      <MemoryRouter initialEntries={['/statistics']}>
        <AppNavigator />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('statistics-screen')).toBeInTheDocument();
    });
  });

  it('設定画面への直接アクセスが正しく動作する', async () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <AppNavigator />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('settings-screen')).toBeInTheDocument();
    });
  });
});
