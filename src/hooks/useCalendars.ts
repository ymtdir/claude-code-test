import { useCallback, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarModel } from '../database/models';
import { CalendarRepository } from '../repositories';
import type { CalendarSchema } from '../database/schema';

/**
 * Hook to get all calendars with live updates
 */
export function useCalendars() {
  const calendars = useLiveQuery(async () => {
    const allCalendars = await CalendarRepository.findAll();
    return allCalendars;
  }, []);

  return {
    calendars: calendars || [],
    isLoading: calendars === undefined,
  };
}

/**
 * Hook to get the default calendar with live updates
 */
export function useDefaultCalendar() {
  const calendar = useLiveQuery(async () => {
    const defaultCalendar = await CalendarRepository.findDefault();
    return defaultCalendar;
  }, []);

  return {
    calendar: calendar || null,
    isLoading: calendar === undefined,
  };
}

/**
 * Hook to get a single calendar by ID with live updates
 */
export function useCalendar(calendarId: string | null) {
  const calendar = useLiveQuery(async () => {
    if (!calendarId) return null;
    const calendarData = await CalendarRepository.findById(calendarId);
    return calendarData;
  }, [calendarId]);

  return {
    calendar: calendar || null,
    isLoading: calendar === undefined,
  };
}

/**
 * Hook to handle calendar mutations (create, update, delete)
 */
export function useCalendarMutations() {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: Error | null;
  }>({
    isLoading: false,
    error: null,
  });

  /**
   * Create a new calendar
   */
  const createCalendar = useCallback(
    async (
      calendarData: Partial<CalendarSchema>
    ): Promise<CalendarModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const newCalendar = await CalendarRepository.create(calendarData);
        setState({ isLoading: false, error: null });
        return newCalendar;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to create calendar:', error);
        return null;
      }
    },
    []
  );

  /**
   * Update an existing calendar
   */
  const updateCalendar = useCallback(
    async (
      id: string,
      calendarData: Partial<CalendarSchema>
    ): Promise<CalendarModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const updatedCalendar = await CalendarRepository.update(
          id,
          calendarData
        );
        setState({ isLoading: false, error: null });
        return updatedCalendar;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to update calendar:', error);
        return null;
      }
    },
    []
  );

  /**
   * Delete a calendar
   */
  const deleteCalendar = useCallback(async (id: string): Promise<boolean> => {
    setState({ isLoading: true, error: null });

    try {
      const success = await CalendarRepository.delete(id);

      if (!success) {
        setState({
          isLoading: false,
          error: new Error(
            'Cannot delete default calendar or calendar not found'
          ),
        });
        return false;
      }

      setState({ isLoading: false, error: null });
      return true;
    } catch (error) {
      setState({ isLoading: false, error: error as Error });
      console.error('Failed to delete calendar:', error);
      return false;
    }
  }, []);

  /**
   * Set a calendar as default
   */
  const setAsDefault = useCallback(
    async (id: string): Promise<CalendarModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const defaultCalendar = await CalendarRepository.setAsDefault(id);
        setState({ isLoading: false, error: null });
        return defaultCalendar;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to set calendar as default:', error);
        return null;
      }
    },
    []
  );

  /**
   * Update calendar color
   */
  const updateCalendarColor = useCallback(
    async (id: string, color: string): Promise<CalendarModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const updatedCalendar = await CalendarRepository.update(id, { color });
        setState({ isLoading: false, error: null });
        return updatedCalendar;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to update calendar color:', error);
        return null;
      }
    },
    []
  );

  /**
   * Ensure default calendar exists
   */
  const ensureDefaultCalendar = useCallback(async (): Promise<void> => {
    setState({ isLoading: true, error: null });

    try {
      await CalendarRepository.ensureDefault();
      setState({ isLoading: false, error: null });
    } catch (error) {
      setState({ isLoading: false, error: error as Error });
      console.error('Failed to ensure default calendar:', error);
    }
  }, []);

  return {
    // Mutation functions
    createCalendar,
    updateCalendar,
    deleteCalendar,
    setAsDefault,
    updateCalendarColor,
    ensureDefaultCalendar,

    // State
    isLoading: state.isLoading,
    error: state.error,
  };
}

/**
 * Hook to get calendar statistics
 */
export function useCalendarStatistics() {
  const statistics = useLiveQuery(async () => {
    const count = await CalendarRepository.count();
    const calendars = await CalendarRepository.findAll();

    return {
      total: count,
      hasDefault: calendars.some((cal) => cal.isDefault),
      colors: calendars.map((cal) => cal.color),
    };
  }, []);

  return {
    statistics: statistics || {
      total: 0,
      hasDefault: false,
      colors: [],
    },
    isLoading: statistics === undefined,
  };
}
