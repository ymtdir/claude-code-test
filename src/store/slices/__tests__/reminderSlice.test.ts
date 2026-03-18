/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * reminderSlice Unit Tests
 */

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
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123',
}));

describe('reminderSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
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
        (require('uuid').v4 as jest.Mock).mockReturnValue('test-uuid-456');
        store.dispatch(addReminder({ taskId: 'task-2', type: 'time' }));

        // Delete first reminder
        store.dispatch(deleteReminder('test-uuid-123'));

        const state = store.getState() as { reminder: any };
        expect(state.reminder.reminders).toHaveLength(1);
        expect(state.reminder.reminders[0].id).toBe('test-uuid-456');
      });
    });

    describe('deleteRemindersByTaskId', () => {
      it('should delete all reminders for a task', () => {
        // Add reminders for different tasks
        store.dispatch(addReminder({ taskId: 'task-1', type: 'time' }));
        (require('uuid').v4 as jest.Mock).mockReturnValue('test-uuid-456');
        store.dispatch(addReminder({ taskId: 'task-1', type: 'repeat' }));
        (require('uuid').v4 as jest.Mock).mockReturnValue('test-uuid-789');
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

        // Initially active
        let state = store.getState() as { reminder: any };
        expect(state.reminder.reminders[0].isActive).toBe(true);

        // Toggle off
        store.dispatch(toggleReminder('test-uuid-123'));
        state = store.getState() as { reminder: any };
        expect(state.reminder.reminders[0].isActive).toBe(false);

        // Toggle on
        store.dispatch(toggleReminder('test-uuid-123'));
        state = store.getState() as { reminder: any };
        expect(state.reminder.reminders[0].isActive).toBe(true);
      });
    });

    describe('setReminders', () => {
      it('should set reminders array', () => {
        const reminders: Reminder[] = [
          {
            id: 'reminder-1',
            taskId: 'task-1',
            type: 'time',
            timeOffset: -10,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'reminder-2',
            taskId: 'task-2',
            type: 'repeat',
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date(),
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
        store.dispatch(
          addReminder({
            taskId: 'task-1',
            type: 'time',
          })
        );
        store.dispatch(toggleReminder('test-uuid-123')); // Make inactive

        store.dispatch(cleanupExpiredReminders());

        const state = store.getState() as { reminder: any };
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
      store.dispatch(
        addReminder({
          taskId: 'task-1',
          type: 'time',
          timeOffset: -10,
        })
      );

      (require('uuid').v4 as jest.Mock).mockReturnValue('test-uuid-456');
      store.dispatch(
        addReminder({
          taskId: 'task-2',
          type: 'repeat',
        })
      );
      store.dispatch(toggleReminder('test-uuid-456')); // Make inactive

      (require('uuid').v4 as jest.Mock).mockReturnValue('test-uuid-789');
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
