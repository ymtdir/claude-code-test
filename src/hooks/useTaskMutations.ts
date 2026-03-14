import { useState, useCallback } from 'react';
import { TaskRepository } from '../repositories';
import { TaskModel } from '../database/models';
import type { TaskSchema } from '../database/schema';

interface MutationState {
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to handle task mutations (create, update, delete)
 */
export function useTaskMutations() {
  const [state, setState] = useState<MutationState>({
    isLoading: false,
    error: null,
  });

  /**
   * Create a new task
   */
  const createTask = useCallback(
    async (taskData: Partial<TaskSchema>): Promise<TaskModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const newTask = await TaskRepository.create(taskData);
        setState({ isLoading: false, error: null });
        return newTask;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to create task:', error);
        return null;
      }
    },
    []
  );

  /**
   * Update an existing task
   */
  const updateTask = useCallback(
    async (
      id: string,
      taskData: Partial<TaskSchema>
    ): Promise<TaskModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const updatedTask = await TaskRepository.update(id, taskData);
        setState({ isLoading: false, error: null });
        return updatedTask;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to update task:', error);
        return null;
      }
    },
    []
  );

  /**
   * Delete a task
   */
  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setState({ isLoading: true, error: null });

    try {
      const success = await TaskRepository.delete(id);
      setState({ isLoading: false, error: null });
      return success;
    } catch (error) {
      setState({ isLoading: false, error: error as Error });
      console.error('Failed to delete task:', error);
      return false;
    }
  }, []);

  /**
   * Toggle task completion status
   */
  const toggleTaskStatus = useCallback(
    async (id: string): Promise<TaskModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const task = await TaskRepository.findById(id);

        if (!task) {
          setState({ isLoading: false, error: new Error('Task not found') });
          return null;
        }

        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const updatedTask = await TaskRepository.update(id, {
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : undefined,
        });

        setState({ isLoading: false, error: null });
        return updatedTask;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to toggle task status:', error);
        return null;
      }
    },
    []
  );

  /**
   * Mark task as completed
   */
  const markAsCompleted = useCallback(
    async (id: string): Promise<TaskModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const completedTask = await TaskRepository.markAsCompleted(id);
        setState({ isLoading: false, error: null });
        return completedTask;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to mark task as completed:', error);
        return null;
      }
    },
    []
  );

  /**
   * Bulk create tasks
   */
  const bulkCreateTasks = useCallback(
    async (tasksData: Partial<TaskSchema>[]): Promise<TaskModel[]> => {
      setState({ isLoading: true, error: null });

      try {
        const newTasks = await TaskRepository.bulkCreate(tasksData);
        setState({ isLoading: false, error: null });
        return newTasks;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to bulk create tasks:', error);
        return [];
      }
    },
    []
  );

  /**
   * Duplicate a task
   */
  const duplicateTask = useCallback(
    async (id: string): Promise<TaskModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const originalTask = await TaskRepository.findById(id);

        if (!originalTask) {
          setState({ isLoading: false, error: new Error('Task not found') });
          return null;
        }

        const duplicatedTask = await TaskRepository.create({
          title: `${originalTask.title} (Copy)`,
          category: originalTask.category,
          date: originalTask.date,
          time: originalTask.time,
          priority: originalTask.priority,
          status: 'pending',
          note: originalTask.note,
        });

        setState({ isLoading: false, error: null });
        return duplicatedTask;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to duplicate task:', error);
        return null;
      }
    },
    []
  );

  /**
   * Move task to a different date
   */
  const moveTaskToDate = useCallback(
    async (id: string, newDate: Date): Promise<TaskModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const movedTask = await TaskRepository.update(id, { date: newDate });
        setState({ isLoading: false, error: null });
        return movedTask;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to move task to new date:', error);
        return null;
      }
    },
    []
  );

  /**
   * Update task priority
   */
  const updateTaskPriority = useCallback(
    async (
      id: string,
      priority: 'low' | 'medium' | 'high'
    ): Promise<TaskModel | null> => {
      setState({ isLoading: true, error: null });

      try {
        const updatedTask = await TaskRepository.update(id, { priority });
        setState({ isLoading: false, error: null });
        return updatedTask;
      } catch (error) {
        setState({ isLoading: false, error: error as Error });
        console.error('Failed to update task priority:', error);
        return null;
      }
    },
    []
  );

  /**
   * Clear all completed tasks
   */
  const clearCompletedTasks = useCallback(async (): Promise<number> => {
    setState({ isLoading: true, error: null });

    try {
      const completedTasks = await TaskRepository.findByStatus('completed');
      let deletedCount = 0;

      for (const task of completedTasks) {
        const success = await TaskRepository.delete(task.id);
        if (success) deletedCount++;
      }

      setState({ isLoading: false, error: null });
      return deletedCount;
    } catch (error) {
      setState({ isLoading: false, error: error as Error });
      console.error('Failed to clear completed tasks:', error);
      return 0;
    }
  }, []);

  return {
    // Mutation functions
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    markAsCompleted,
    bulkCreateTasks,
    duplicateTask,
    moveTaskToDate,
    updateTaskPriority,
    clearCompletedTasks,

    // State
    isLoading: state.isLoading,
    error: state.error,
  };
}
