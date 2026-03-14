import { useCallback, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ReminderModel } from '../database/models';
import { ReminderRepository } from '../repositories';
import type { ReminderSchema } from '../database/schema';

/**
 * Hook to get all reminders with live updates
 */
export function useReminders() {
  const reminders = useLiveQuery(async () => {
    const allReminders = await ReminderRepository.findAll();
    return allReminders;
  }, []);

  return {
    reminders: reminders || [],
    isLoading: reminders === undefined,
  };
}

/**
 * Hook to get reminders for a specific task with live updates
 */
export function useTaskReminders(taskId: string | null) {
  const reminders = useLiveQuery(async () => {
    if (!taskId) return [];
    const taskReminders = await ReminderRepository.findByTaskId(taskId);
    return taskReminders;
  }, [taskId]);

  return {
    reminders: reminders || [],
    isLoading: reminders === undefined,
  };
}

/**
 * Hook to get active reminders with live updates
 */
export function useActiveReminders() {
  const reminders = useLiveQuery(async () => {
    const activeReminders = await ReminderRepository.findActive();
    return activeReminders;
  }, []);

  return {
    reminders: reminders || [],
    isLoading: reminders === undefined,
  };
}

/**
 * Hook to get upcoming reminders within a time range
 */
export function useUpcomingReminders(fromTime: Date, toTime: Date) {
  const reminders = useLiveQuery(async () => {
    const upcomingReminders = await ReminderRepository.getUpcomingReminders(
      fromTime,
      toTime
    );
    return upcomingReminders;
  }, [fromTime.toISOString(), toTime.toISOString()]);

  return {
    reminders: reminders || [],
    isLoading: reminders === undefined,
  };
}

/**
 * Hook to handle reminder mutations (create, update, delete)
 */
export function useReminderMutations() {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: Error | null;
  }>({
    isLoading: false,
    error: null,
  });

  /**
   * Create a new reminder
   */
  const createReminder = useCallback(
    async (
      reminderData: Partial<ReminderSchema>
    ): Promise<ReminderModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const newReminder = await ReminderRepository.create(reminderData);
        setState({ isLoading: false, error: null });
        return newReminder;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to create reminder:', error);
        return null;
      }
    },
    []
  );

  /**
   * Update an existing reminder
   */
  const updateReminder = useCallback(
    async (
      id: string,
      reminderData: Partial<ReminderSchema>
    ): Promise<ReminderModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const updatedReminder = await ReminderRepository.update(
          id,
          reminderData
        );
        setState({ isLoading: false, error: null });
        return updatedReminder;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to update reminder:', error);
        return null;
      }
    },
    []
  );

  /**
   * Delete a reminder
   */
  const deleteReminder = useCallback(async (id: string): Promise<boolean> => {
    setState({ isLoading: true, error: null });

    try {
      const success = await ReminderRepository.delete(id);
      setState({ isLoading: false, error: null });
      return success;
    } catch (error) {
      setState({ isLoading: false, error: error as Error });
      console.error('Failed to delete reminder:', error);
      return false;
    }
  }, []);

  /**
   * Create or update reminder for a task
   */
  const upsertTaskReminder = useCallback(
    async (
      taskId: string,
      reminderData: Partial<ReminderSchema>
    ): Promise<ReminderModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const reminder = await ReminderRepository.upsertForTask(
          taskId,
          reminderData
        );
        setState({ isLoading: false, error: null });
        return reminder;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to upsert task reminder:', error);
        return null;
      }
    },
    []
  );

  /**
   * Activate a reminder
   */
  const activateReminder = useCallback(
    async (id: string): Promise<ReminderModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const activatedReminder = await ReminderRepository.activate(id);
        setState({ isLoading: false, error: null });
        return activatedReminder;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to activate reminder:', error);
        return null;
      }
    },
    []
  );

  /**
   * Deactivate a reminder
   */
  const deactivateReminder = useCallback(
    async (id: string): Promise<ReminderModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const deactivatedReminder = await ReminderRepository.deactivate(id);
        setState({ isLoading: false, error: null });
        return deactivatedReminder;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to deactivate reminder:', error);
        return null;
      }
    },
    []
  );

  /**
   * Update reminder type
   */
  const updateReminderType = useCallback(
    async (
      id: string,
      type: ReminderModel['type']
    ): Promise<ReminderModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const updatedReminder = await ReminderRepository.update(id, { type });
        setState({ isLoading: false, error: null });
        return updatedReminder;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to update reminder type:', error);
        return null;
      }
    },
    []
  );

  /**
   * Delete all reminders for a task
   */
  const deleteTaskReminders = useCallback(
    async (taskId: string): Promise<number> => {
      setState({ isLoading: true, error: null });

      try {
        const deletedCount = await ReminderRepository.deleteByTaskId(taskId);
        setState({ isLoading: false, error: null });
        return deletedCount;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to delete task reminders:', error);
        return 0;
      }
    },
    []
  );

  return {
    // Mutation functions
    createReminder,
    updateReminder,
    deleteReminder,
    upsertTaskReminder,
    activateReminder,
    deactivateReminder,
    updateReminderType,
    deleteTaskReminders,

    // State
    isLoading: state.isLoading,
    error: state.error,
  };
}

/**
 * Hook to get reminder statistics
 */
export function useReminderStatistics() {
  const statistics = useLiveQuery(async () => {
    const stats = await ReminderRepository.getStatistics();
    return stats;
  }, []);

  return {
    statistics: statistics || {
      total: 0,
      active: 0,
      inactive: 0,
      byType: {},
    },
    isLoading: statistics === undefined,
  };
}

/**
 * Hook to check if reminders should trigger
 */
export function useReminderTrigger(checkIntervalMs: number = 60000) {
  const [upcomingReminders, setUpcomingReminders] = useState<
    {
      reminder: ReminderModel;
      triggerTime: Date;
    }[]
  >([]);

  useCallback(async () => {
    const now = new Date();
    const checkWindow = new Date(now.getTime() + checkIntervalMs);

    const reminders = await ReminderRepository.getUpcomingReminders(
      now,
      checkWindow
    );
    setUpcomingReminders(reminders);

    // Set up interval to check for reminders
    const intervalId = setInterval(async () => {
      const currentTime = new Date();
      const nextWindow = new Date(currentTime.getTime() + checkIntervalMs);
      const nextReminders = await ReminderRepository.getUpcomingReminders(
        currentTime,
        nextWindow
      );
      setUpcomingReminders(nextReminders);
    }, checkIntervalMs);

    return () => clearInterval(intervalId);
  }, [checkIntervalMs]);

  return {
    upcomingReminders,
    hasUpcoming: upcomingReminders.length > 0,
  };
}
