import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import 'fake-indexeddb/auto';
import { TaskRepository } from '../TaskRepository';
import { db } from '../../database';

describe('TaskRepository', () => {
  beforeAll(async () => {
    // Initialize database for tests
    await db.open();
  });

  beforeEach(async () => {
    // Clear database before each test
    await db.clearAllData();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        category: 'work',
        date: new Date(),
        priority: 'medium' as const,
        status: 'pending' as const,
      };

      const task = await TaskRepository.create(taskData);

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.category).toBe('work');
      expect(task.priority).toBe('medium');
      expect(task.status).toBe('pending');
    });
  });

  describe('findById', () => {
    it('should find a task by ID', async () => {
      const taskData = {
        title: 'Find Me',
        category: 'personal',
        date: new Date(),
      };

      const created = await TaskRepository.create(taskData);
      const found = await TaskRepository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe('Find Me');
    });

    it('should return null for non-existent ID', async () => {
      const found = await TaskRepository.findById('non-existent');
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const task = await TaskRepository.create({
        title: 'Original Title',
        category: 'work',
        date: new Date(),
      });

      const updated = await TaskRepository.update(task.id, {
        title: 'Updated Title',
        status: 'completed' as const,
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.status).toBe('completed');
      expect(updated?.category).toBe('work'); // Unchanged field
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const task = await TaskRepository.create({
        title: 'Delete Me',
        category: 'test',
        date: new Date(),
      });

      const deleted = await TaskRepository.delete(task.id);
      expect(deleted).toBe(true);

      const found = await TaskRepository.findById(task.id);
      expect(found).toBeNull();
    });
  });

  describe('findByDate', () => {
    it('should find tasks by date', async () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      await TaskRepository.create({
        title: 'Today Task 1',
        category: 'work',
        date: today,
      });

      await TaskRepository.create({
        title: 'Today Task 2',
        category: 'personal',
        date: today,
      });

      await TaskRepository.create({
        title: 'Tomorrow Task',
        category: 'work',
        date: tomorrow,
      });

      const todayTasks = await TaskRepository.findByDate(today);
      expect(todayTasks).toHaveLength(2);
      expect(todayTasks.map((t) => t.title)).toContain('Today Task 1');
      expect(todayTasks.map((t) => t.title)).toContain('Today Task 2');
    });
  });

  describe('findByStatus', () => {
    it('should find tasks by status', async () => {
      await TaskRepository.create({
        title: 'Pending Task',
        category: 'work',
        date: new Date(),
        status: 'pending' as const,
      });

      await TaskRepository.create({
        title: 'Completed Task',
        category: 'work',
        date: new Date(),
        status: 'completed' as const,
      });

      const pendingTasks = await TaskRepository.findByStatus('pending');
      expect(pendingTasks).toHaveLength(1);
      expect(pendingTasks[0].title).toBe('Pending Task');

      const completedTasks = await TaskRepository.findByStatus('completed');
      expect(completedTasks).toHaveLength(1);
      expect(completedTasks[0].title).toBe('Completed Task');
    });
  });
});
