/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * reminderSlice Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reminderReducer, {
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
  selectAllReminders,
  selectActiveReminders,
  selectRemindersByTaskId,
  selectReminderById,
  selectNotificationPermission,
  selectReminderLoading,
  selectReminderError,
  selectRemindersWithFilter,
} from '../reminderSlice';
import type { RootState } from '../../store';
import type {
  CreateReminderDto,
  UpdateReminderDto,
  Reminder,
} from '../../../types/reminder';

// Mock UUID
const mockUuid = vi.fn();
vi.mock('uuid', () => ({
  v4: () => mockUuid(),
}));

describe('reminderSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    // Reset UUID mock
    mockUuid.mockReset();
    mockUuid.mockReturnValue('test-uuid-123');

    store = configureStore({
      reducer: {
        reminder: reminderReducer,
      },
    });
  });

  describe('actions', () => {
    describe('addReminder', () => {
      it('should add a new reminder', () => {
        const reminderData: CreateReminderDto = {
          taskId: 'task-1',
          type: 'time',
          timeOffset: -10,
        };

        store.dispatch(addReminder(reminderData));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(1);
        expect(state.reminder.reminders[0]).toMatchObject({
          id: 'test-uuid-123',
          taskId: 'task-1',
          type: 'time',
          timeOffset: -10,
          isActive: true,
        });
      });

      it('should add reminder with repeat rule', () => {
        const reminderData: CreateReminderDto = {
          taskId: 'task-2',
          type: 'repeat',
          repeatRule: {
            frequency: 'daily',
            interval: 1,
          },
        };

        store.dispatch(addReminder(reminderData));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders[0]).toMatchObject({
          type: 'repeat',
          repeatRule: {
            frequency: 'daily',
            interval: 1,
          },
        });
      });
    });

    describe('updateReminder', () => {
      it('should update existing reminder', () => {
        // First add a reminder
        const reminderData: CreateReminderDto = {
          taskId: 'task-1',
          type: 'time',
          timeOffset: -10,
        };
        store.dispatch(addReminder(reminderData));

        // Then update it
        const updateData: UpdateReminderDto = {
          id: 'test-uuid-123',
          timeOffset: -30,
          isActive: false,
        };
        store.dispatch(updateReminder(updateData));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders[0]).toMatchObject({
          id: 'test-uuid-123',
          timeOffset: -30,
          isActive: false,
        });
      });

      it('should not update non-existent reminder', () => {
        const updateData: UpdateReminderDto = {
          id: 'non-existent',
          timeOffset: -30,
        };

        store.dispatch(updateReminder(updateData));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(0);
      });
    });

    describe('deleteReminder', () => {
      it('should delete reminder by id', () => {
        // Add two reminders
        store.dispatch(addReminder({ taskId: 'task-1', type: 'time' }));

        // Mock UUID to return different value
        mockUuid.mockReturnValue('test-uuid-456');
        store.dispatch(addReminder({ taskId: 'task-2', type: 'time' }));

        // Get current state to find the actual IDs
        let state = store.getState() as { reminder: any };
        const firstId = state.reminder.reminders[0].id;
        const secondId = state.reminder.reminders[1].id;

        // Delete first reminder
        store.dispatch(deleteReminder(firstId));

        state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(1);
        expect(state.reminder.reminders[0].id).toBe(secondId);
      });
    });

    describe('deleteRemindersByTaskId', () => {
      it('should delete all reminders for a task', () => {
        // Add reminders for different tasks
        store.dispatch(addReminder({ taskId: 'task-1', type: 'time' }));
        mockUuid.mockReturnValue('test-uuid-456');
        store.dispatch(addReminder({ taskId: 'task-1', type: 'repeat' }));
        mockUuid.mockReturnValue('test-uuid-789');
        store.dispatch(addReminder({ taskId: 'task-2', type: 'time' }));

        // Delete reminders for task-1
        store.dispatch(deleteRemindersByTaskId('task-1'));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(1);
        expect(state.reminder.reminders[0].taskId).toBe('task-2');
      });
    });

    describe('toggleReminder', () => {
      it('should toggle reminder active state', () => {
        store.dispatch(addReminder({ taskId: 'task-1', type: 'time' }));

        // Get the actual reminder ID
        let state = store.getState() as { reminder: any };
        const reminderId = state.reminder.reminders[0].id;

        // Initially active
        expect(state.reminder.reminders[0].isActive).toBe(true);

        // Toggle off
        store.dispatch(toggleReminder(reminderId));
        state = store.getState() as { reminder: any };
        expect(state.reminder.reminders[0].isActive).toBe(false);

        // Toggle on
        store.dispatch(toggleReminder(reminderId));
        state = store.getState() as { reminder: any };
        expect(state.reminder.reminders[0].isActive).toBe(true);
      });
    });

    describe('setReminders', () => {
      it('should set reminders array', () => {
        const now = new Date().toISOString();
        const reminders: Reminder[] = [
          {
            id: 'reminder-1',
            taskId: 'task-1',
            type: 'time',
            timeOffset: -10,
            isActive: true,
            createdAt: now as any,
            updatedAt: now as any,
          },
          {
            id: 'reminder-2',
            taskId: 'task-2',
            type: 'repeat',
            isActive: false,
            createdAt: now as any,
            updatedAt: now as any,
          },
        ];

        store.dispatch(setReminders(reminders));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toEqual(reminders);
      });
    });

    describe('setNotificationPermission', () => {
      it('should set notification permission', () => {
        store.dispatch(setNotificationPermission('granted'));

        let state = store.getState() as { reminder: any };
        expect(state.reminder.notificationPermission).toBe('granted');

        store.dispatch(setNotificationPermission('denied'));
        state = store.getState() as { reminder: any };
        expect(state.reminder.notificationPermission).toBe('denied');
      });
    });

    describe('setError', () => {
      it('should set error message', () => {
        store.dispatch(setError('Something went wrong'));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.error).toBe('Something went wrong');
      });

      it('should clear error with null', () => {
        store.dispatch(setError('Error'));
        store.dispatch(setError(null));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.error).toBeNull();
      });
    });

    describe('setLoading', () => {
      it('should set loading state', () => {
        store.dispatch(setLoading(true));

        let state = store.getState() as { reminder: any };
        expect(state.reminder.loading).toBe(true);

        store.dispatch(setLoading(false));
        state = store.getState() as { reminder: any };
        expect(state.reminder.loading).toBe(false);
      });
    });

    describe('cleanupExpiredReminders', () => {
      it('should keep repeat reminders', () => {
        store.dispatch(
          addReminder({
            taskId: 'task-1',
            type: 'repeat',
            repeatRule: { frequency: 'daily' },
          })
        );

        store.dispatch(cleanupExpiredReminders());

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(1);
      });

      it('should keep active time reminders', () => {
        store.dispatch(
          addReminder({
            taskId: 'task-1',
            type: 'time',
            timeOffset: -10,
          })
        );

        store.dispatch(cleanupExpiredReminders());

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(1);
      });

      it('should remove inactive time reminders', () => {
        // Add a time reminder
        store.dispatch(
          addReminder({
            taskId: 'task-1',
            type: 'time',
          })
        );

        // Get current state to find the actual ID
        let state = store.getState() as { reminder: any };
        const reminderId = state.reminder.reminders[0].id;

        // Toggle to make it inactive
        store.dispatch(toggleReminder(reminderId));

        // Verify it's now inactive
        state = store.getState() as { reminder: any };
        expect(state.reminder.reminders[0].isActive).toBe(false);

        // Clean up expired reminders
        store.dispatch(cleanupExpiredReminders());

        // Should be removed
        state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(0);
      });
    });

    describe('resetReminderState', () => {
      it('should reset to initial state', () => {
        // Add some data
        store.dispatch(addReminder({ taskId: 'task-1', type: 'time' }));
        store.dispatch(setNotificationPermission('granted'));
        store.dispatch(setError('Error'));
        store.dispatch(setLoading(true));

        // Reset
        store.dispatch(resetReminderState());

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(0);
        expect(state.reminder.notificationPermission).toBeNull();
        expect(state.reminder.error).toBeNull();
        expect(state.reminder.loading).toBe(false);
      });
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      // Setup test data
      // Reset UUID mock to start with 'test-uuid-123'
      mockUuid.mockReset();
      mockUuid.mockReturnValue('test-uuid-123');

      store.dispatch(
        addReminder({
          taskId: 'task-1',
          type: 'time',
          timeOffset: -10,
        })
      );

      mockUuid.mockReturnValue('test-uuid-456');
      store.dispatch(
        addReminder({
          taskId: 'task-2',
          type: 'repeat',
        })
      );

      // Get actual IDs to toggle
      const state = store.getState() as { reminder: any };
      const secondReminderId = state.reminder.reminders[1].id;
      store.dispatch(toggleReminder(secondReminderId)); // Make inactive

      mockUuid.mockReturnValue('test-uuid-789');
      store.dispatch(
        addReminder({
          taskId: 'task-1',
          type: 'time',
          timeOffset: -30,
        })
      );

      store.dispatch(setNotificationPermission('granted'));
      store.dispatch(setError('Test error'));
      store.dispatch(setLoading(true));
    });

    it('selectAllReminders should return all reminders', () => {
      const state = store.getState() as RootState;
      const reminders = selectAllReminders(state);
      expect(reminders).toHaveLength(3);
    });

    it('selectActiveReminders should return only active reminders', () => {
      const state = store.getState() as RootState;
      const reminders = selectActiveReminders(state);
      expect(reminders).toHaveLength(2);
      expect(reminders.every((r) => r.isActive)).toBe(true);
    });

    it('selectRemindersByTaskId should return reminders for specific task', () => {
      const state = store.getState() as RootState;
      const reminders = selectRemindersByTaskId('task-1')(state);
      expect(reminders).toHaveLength(2);
      expect(reminders.every((r) => r.taskId === 'task-1')).toBe(true);
    });

    it('selectReminderById should return specific reminder', () => {
      const state = store.getState() as RootState;
      const reminder = selectReminderById('test-uuid-456')(state);
      expect(reminder).toBeDefined();
      expect(reminder?.id).toBe('test-uuid-456');
    });

    it('selectNotificationPermission should return permission', () => {
      const state = store.getState() as RootState;
      expect(selectNotificationPermission(state)).toBe('granted');
    });

    it('selectReminderLoading should return loading state', () => {
      const state = store.getState() as RootState;
      expect(selectReminderLoading(state)).toBe(true);
    });

    it('selectReminderError should return error', () => {
      const state = store.getState() as RootState;
      expect(selectReminderError(state)).toBe('Test error');
    });

    it('selectRemindersWithFilter should filter reminders', () => {
      const state = store.getState() as RootState;

      // Filter by taskId
      let filtered = selectRemindersWithFilter({ taskId: 'task-1' })(state);
      expect(filtered).toHaveLength(2);

      // Filter by type
      filtered = selectRemindersWithFilter({ type: 'repeat' })(state);
      expect(filtered).toHaveLength(1);

      // Filter by isActive
      filtered = selectRemindersWithFilter({ isActive: false })(state);
      expect(filtered).toHaveLength(1);

      // Combined filters
      filtered = selectRemindersWithFilter({
        taskId: 'task-1',
        type: 'time',
        isActive: true,
      })(state);
      expect(filtered).toHaveLength(2);
    });
  });
});
