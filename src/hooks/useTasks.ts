import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { TaskModel } from '../database/models';
import { TaskRepository } from '../repositories';
import { db } from '../database';

/**
 * Hook to get all tasks with live updates
 */
export function useTasks() {
  const tasks = useLiveQuery(async () => {
    const allTasks = await TaskRepository.findAll();
    return allTasks;
  }, []);

  return {
    tasks: tasks || [],
    isLoading: tasks === undefined,
  };
}

/**
 * Hook to get tasks for a specific date with live updates
 */
export function useTasksByDate(date: Date | null) {
  const tasks = useLiveQuery(async () => {
    if (!date) return [];
    const tasksForDate = await TaskRepository.findByDate(date);
    return tasksForDate;
  }, [date?.toISOString()]);

  return {
    tasks: tasks || [],
    isLoading: tasks === undefined,
  };
}

/**
 * Hook to get tasks by status with live updates
 */
export function useTasksByStatus(
  status: 'pending' | 'completed' | 'cancelled'
) {
  const tasks = useLiveQuery(async () => {
    const tasksByStatus = await TaskRepository.findByStatus(status);
    return tasksByStatus;
  }, [status]);

  return {
    tasks: tasks || [],
    isLoading: tasks === undefined,
  };
}

/**
 * Hook to get tasks by category with live updates
 */
export function useTasksByCategory(category: string) {
  const tasks = useLiveQuery(async () => {
    const tasksByCategory = await TaskRepository.findByCategory(category);
    return tasksByCategory;
  }, [category]);

  return {
    tasks: tasks || [],
    isLoading: tasks === undefined,
  };
}

/**
 * Hook to get tasks for a date range with live updates
 */
export function useTasksByDateRange(startDate: Date, endDate: Date) {
  const tasks = useLiveQuery(async () => {
    const tasksInRange = await TaskRepository.findByDateRange(
      startDate,
      endDate
    );
    return tasksInRange;
  }, [startDate.toISOString(), endDate.toISOString()]);

  return {
    tasks: tasks || [],
    isLoading: tasks === undefined,
  };
}

/**
 * Hook to get overdue tasks with live updates
 */
export function useOverdueTasks() {
  const tasks = useLiveQuery(async () => {
    const overdueTasks = await TaskRepository.findOverdue();
    return overdueTasks;
  }, []);

  return {
    tasks: tasks || [],
    isLoading: tasks === undefined,
  };
}

/**
 * Hook to get task statistics with live updates
 */
export function useTaskStatistics() {
  const statistics = useLiveQuery(async () => {
    const stats = await TaskRepository.getStatistics();
    return stats;
  }, []);

  return {
    statistics: statistics || {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      overdue: 0,
    },
    isLoading: statistics === undefined,
  };
}

/**
 * Hook to search tasks by title
 */
export function useTaskSearch(searchQuery: string, debounceMs: number = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  const tasks = useLiveQuery(async () => {
    if (!debouncedQuery) return [];
    const searchResults = await TaskRepository.searchByTitle(debouncedQuery);
    return searchResults;
  }, [debouncedQuery]);

  return {
    tasks: tasks || [],
    isLoading: tasks === undefined,
    isSearching: searchQuery !== debouncedQuery,
  };
}

/**
 * Hook to get a single task by ID with live updates
 */
export function useTask(taskId: string | null) {
  const task = useLiveQuery(async () => {
    if (!taskId) return null;
    const taskData = await TaskRepository.findById(taskId);
    return taskData;
  }, [taskId]);

  return {
    task: task || null,
    isLoading: task === undefined,
  };
}

/**
 * Hook to subscribe to task changes
 */
export function useTaskSubscription(
  callback: (changes: {
    created: TaskModel[];
    updated: TaskModel[];
    deleted: string[];
  }) => void
) {
  useEffect(() => {
    const subscription = db.tasks.hook('creating', function (primKey, obj) {
      // Task is being created
      const taskModel = TaskModel.fromDatabase(obj);
      callback({ created: [taskModel], updated: [], deleted: [] });
    });

    const updateSubscription = db.tasks.hook(
      'updating',
      function (modifications, primKey) {
        // Task is being updated
        db.tasks.get(primKey).then((task) => {
          if (task) {
            const taskModel = TaskModel.fromDatabase(task);
            callback({ created: [], updated: [taskModel], deleted: [] });
          }
        });
      }
    );

    const deleteSubscription = db.tasks.hook('deleting', function (primKey) {
      // Task is being deleted
      callback({ created: [], updated: [], deleted: [primKey] });
    });

    return () => {
      subscription.unsubscribe();
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    };
  }, [callback]);
}
