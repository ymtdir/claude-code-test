/**
 * validationのテスト
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  validateTask,
  validateField,
  validateTitle,
  validateDate,
  validateTime,
  validateNote,
} from './validation';
import type { TaskInput } from '../types/task';

describe('validation', () => {
  describe('validateTask', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-19T10:00:00Z'));
    });

    it('should pass validation for valid task', () => {
      const validTask: Partial<TaskInput> = {
        title: 'Valid Task',
        category: '仕事',
        date: new Date('2026-03-20'),
        time: '10:00',
        priority: 'medium',
      };

      const result = validateTask(validTask);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    describe('title validation', () => {
      it('should fail for empty title', () => {
        const task = { title: '' };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].field).toBe('title');
        expect(result.errors[0].message).toBe('タイトルは必須です');
      });

      it('should fail for whitespace-only title', () => {
        const task = { title: '   ' };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].message).toBe('タイトルは必須です');
      });

      it('should fail for title exceeding 100 characters', () => {
        const task = { title: 'a'.repeat(101) };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('title');
        expect(result.errors[0].message).toBe(
          'タイトルは100文字以内で入力してください'
        );
      });

      it('should pass for title with exactly 100 characters', () => {
        const task = { title: 'a'.repeat(100) };
        const result = validateTask(task);

        expect(result.isValid).toBe(true);
      });
    });

    describe('date validation', () => {
      it('should fail for past date', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          date: new Date('2026-03-18'), // Yesterday
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('date');
        expect(result.errors[0].message).toBe('過去の日付は選択できません');
      });

      it('should pass for today', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          date: new Date('2026-03-19'),
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(true);
      });

      it('should pass for future date', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          date: new Date('2026-03-20'),
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(true);
      });
    });

    describe('time validation', () => {
      it('should pass for valid time format', () => {
        const task = { title: 'Task', time: '10:30' };
        const result = validateTask(task);

        expect(result.isValid).toBe(true);
      });

      it('should fail for invalid time format', () => {
        const task = { title: 'Task', time: '25:30' };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('time');
        expect(result.errors[0].message).toBe(
          '時刻は HH:mm 形式で入力してください'
        );
      });

      it('should fail for time without colon', () => {
        const task = { title: 'Task', time: '1030' };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
      });
    });

    describe('note validation', () => {
      it('should pass for note under 500 characters', () => {
        const task = { title: 'Task', note: 'a'.repeat(500) };
        const result = validateTask(task);

        expect(result.isValid).toBe(true);
      });

      it('should fail for note exceeding 500 characters', () => {
        const task = { title: 'Task', note: 'a'.repeat(501) };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('note');
        expect(result.errors[0].message).toBe(
          'メモは500文字以内で入力してください'
        );
      });
    });

    describe('repeatRule validation', () => {
      it('should fail if endDate is before startDate', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          date: new Date('2026-03-20'),
          repeatRule: {
            frequency: 'daily',
            endDate: new Date('2026-03-19'),
          },
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('repeatRule.endDate');
        expect(result.errors[0].message).toBe(
          '終了日は開始日より後に設定してください'
        );
      });

      it('should pass for interval of 1', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          repeatRule: {
            frequency: 'daily',
            interval: 1,
          },
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(true);
      });

      it('should fail for invalid daysOfWeek', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          repeatRule: {
            frequency: 'weekly',
            daysOfWeek: [7, 8], // Invalid days
          },
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('repeatRule.daysOfWeek');
      });

      it('should fail for invalid dayOfMonth', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          repeatRule: {
            frequency: 'monthly',
            dayOfMonth: 32, // Invalid day
          },
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('repeatRule.dayOfMonth');
      });
    });

    describe('reminders validation', () => {
      it('should fail for negative timeOffset', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          reminders: [
            {
              id: '1',
              taskId: '1',
              type: 'time',
              timeOffset: -5,
              isActive: true,
            },
          ],
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('reminders[0].timeOffset');
      });

      it('should fail for location reminder without location', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          reminders: [
            {
              id: '1',
              taskId: '1',
              type: 'location',
              isActive: true,
            },
          ],
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('reminders[0].location');
      });

      it('should fail for invalid latitude', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          reminders: [
            {
              id: '1',
              taskId: '1',
              type: 'location',
              location: {
                latitude: 91, // Invalid
                longitude: 0,
              },
              isActive: true,
            },
          ],
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('reminders[0].location.latitude');
      });

      it('should fail for invalid longitude', () => {
        const task: Partial<TaskInput> = {
          title: 'Task',
          reminders: [
            {
              id: '1',
              taskId: '1',
              type: 'location',
              location: {
                latitude: 0,
                longitude: 181, // Invalid
              },
              isActive: true,
            },
          ],
        };
        const result = validateTask(task);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].field).toBe('reminders[0].location.longitude');
      });
    });

    it('should collect multiple errors', () => {
      const task: Partial<TaskInput> = {
        title: '', // Empty
        time: '25:00', // Invalid
        note: 'a'.repeat(501), // Too long
      };
      const result = validateTask(task);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('validateField', () => {
    it('should validate single field', () => {
      const error = validateField('title', '');
      expect(error).not.toBeNull();
      expect(error?.field).toBe('title');
    });

    it('should return null for valid field', () => {
      const error = validateField('title', 'Valid Title');
      expect(error).toBeNull();
    });
  });

  describe('validateTitle', () => {
    it('should return error for empty title', () => {
      const error = validateTitle('');
      expect(error).toBe('タイトルは必須です');
    });

    it('should return error for whitespace-only title', () => {
      const error = validateTitle('   ');
      expect(error).toBe('タイトルは必須です');
    });

    it('should return error for title exceeding 100 characters', () => {
      const error = validateTitle('a'.repeat(101));
      expect(error).toBe('タイトルは100文字以内で入力してください');
    });

    it('should return null for valid title', () => {
      const error = validateTitle('Valid Title');
      expect(error).toBeNull();
    });
  });

  describe('validateDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-19T10:00:00Z'));
    });

    it('should return error for past date', () => {
      const error = validateDate(new Date('2026-03-18'));
      expect(error).toBe('過去の日付は選択できません');
    });

    it('should return null for today', () => {
      const error = validateDate(new Date('2026-03-19'));
      expect(error).toBeNull();
    });

    it('should return null for future date', () => {
      const error = validateDate(new Date('2026-03-20'));
      expect(error).toBeNull();
    });
  });

  describe('validateTime', () => {
    it('should return error for invalid format', () => {
      const error = validateTime('25:00');
      expect(error).toBe('時刻は HH:mm 形式で入力してください');
    });

    it('should return null for valid format', () => {
      const error = validateTime('10:30');
      expect(error).toBeNull();
    });

    it('should accept single digit hour', () => {
      const error = validateTime('9:30');
      expect(error).toBeNull();
    });
  });

  describe('validateNote', () => {
    it('should return error for note exceeding 500 characters', () => {
      const error = validateNote('a'.repeat(501));
      expect(error).toBe('メモは500文字以内で入力してください');
    });

    it('should return null for valid note', () => {
      const error = validateNote('Valid note');
      expect(error).toBeNull();
    });

    it('should return null for empty note', () => {
      const error = validateNote('');
      expect(error).toBeNull();
    });
  });
});
