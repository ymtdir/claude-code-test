/**
 * dateUtilsのテスト
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatDate,
  parseDate,
  getRelativeTime,
  addDaysToDate,
  subtractDaysFromDate,
  isDateInPast,
  isDateInFuture,
  formatTime,
  combineDateAndTime,
  getDaysBetween,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfDay,
  getEndOfDay,
  isSameDay,
  parseISODate,
  toISODateString,
} from './dateUtils';

describe('dateUtils', () => {
  // 固定の日時でテスト
  const testDate = new Date('2026-03-19T10:00:00Z');

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const result = formatDate(testDate);
      expect(result).toBe('2026-03-19');
    });

    it('should format date with custom format', () => {
      const result = formatDate(testDate, 'yyyy/MM/dd');
      expect(result).toBe('2026/03/19');
    });

    it('should format date with different locale', () => {
      const result = formatDate(testDate, 'MMM dd, yyyy', 'en');
      expect(result).toBe('Mar 19, 2026');
    });

    it('should handle string input', () => {
      const result = formatDate('2026-03-19');
      expect(result).toBe('2026-03-19');
    });

    it('should handle number input', () => {
      const result = formatDate(testDate.getTime());
      expect(result).toBe('2026-03-19');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('');
    });
  });

  describe('parseDate', () => {
    it('should parse date string with default format', () => {
      const result = parseDate('2026-03-19');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2026);
      expect(result?.getMonth()).toBe(2); // 0-indexed
      expect(result?.getDate()).toBe(19);
    });

    it('should parse date string with custom format', () => {
      const result = parseDate('19/03/2026', 'dd/MM/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2026);
    });

    it('should return null for invalid date string', () => {
      const result = parseDate('invalid');
      expect(result).toBeNull();
    });
  });

  describe('getRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should return "今日" for today', () => {
      vi.setSystemTime(testDate);
      const result = getRelativeTime(testDate, testDate);
      expect(result).toBe('今日');
    });

    it('should return "明日" for tomorrow', () => {
      vi.setSystemTime(testDate);
      const tomorrow = new Date(testDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = getRelativeTime(tomorrow, testDate);
      expect(result).toBe('明日');
    });

    it('should return "昨日" for yesterday', () => {
      vi.setSystemTime(testDate);
      const yesterday = new Date(testDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const result = getRelativeTime(yesterday, testDate);
      expect(result).toBe('昨日');
    });

    it('should return relative time for different days', () => {
      vi.setSystemTime(testDate);
      const past = new Date(testDate.getTime() - 2 * 24 * 60 * 60 * 1000); // 2日前
      const result = getRelativeTime(past, testDate);
      expect(result).toBe('2日前');
    });

    it('should return formatted date for dates more than 30 days apart', () => {
      vi.setSystemTime(testDate);
      const past = new Date(testDate.getTime() - 31 * 24 * 60 * 60 * 1000); // 31日前
      const result = getRelativeTime(past, testDate);
      expect(result).toContain('2026');
    });

    it('should return empty string for invalid date', () => {
      const result = getRelativeTime('invalid');
      expect(result).toBe('');
    });
  });

  describe('addDaysToDate', () => {
    it('should add days to date', () => {
      const result = addDaysToDate(testDate, 5);
      expect(result.getDate()).toBe(24);
    });

    it('should handle string input', () => {
      const result = addDaysToDate('2026-03-19', 5);
      expect(result.getDate()).toBe(24);
    });
  });

  describe('subtractDaysFromDate', () => {
    it('should subtract days from date', () => {
      const result = subtractDaysFromDate(testDate, 5);
      expect(result.getDate()).toBe(14);
    });
  });

  describe('isDateInPast', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(testDate);
    });

    it('should return true for past date', () => {
      const pastDate = new Date('2026-03-18');
      const result = isDateInPast(pastDate);
      expect(result).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date('2026-03-20');
      const result = isDateInPast(futureDate);
      expect(result).toBe(false);
    });
  });

  describe('isDateInFuture', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(testDate);
    });

    it('should return true for future date', () => {
      const futureDate = new Date('2026-03-20');
      const result = isDateInFuture(futureDate);
      expect(result).toBe(true);
    });

    it('should return false for past date', () => {
      const pastDate = new Date('2026-03-18');
      const result = isDateInFuture(pastDate);
      expect(result).toBe(false);
    });
  });

  describe('formatTime', () => {
    it('should format time in 24-hour format', () => {
      const result = formatTime(testDate);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should format time in 12-hour format', () => {
      const result = formatTime(testDate, false);
      // 日本語ロケールでは「午前」「午後」が使われる
      expect(result).toMatch(/\d{1,2}:\d{2}/);
      expect(result.length).toBeGreaterThan(4);
    });
  });

  describe('combineDateAndTime', () => {
    it('should combine date and time string', () => {
      const result = combineDateAndTime(testDate, '14:30');
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });
  });

  describe('getDaysBetween', () => {
    it('should calculate days between dates', () => {
      const startDate = new Date('2026-03-19');
      const endDate = new Date('2026-03-24');
      const result = getDaysBetween(startDate, endDate);
      expect(result).toBe(5);
    });

    it('should handle string inputs', () => {
      const result = getDaysBetween('2026-03-19', '2026-03-24');
      expect(result).toBe(5);
    });
  });

  describe('getStartOfWeek', () => {
    it('should get start of week (Monday)', () => {
      const result = getStartOfWeek(testDate, 1);
      expect(result.getDay()).toBe(1);
    });

    it('should get start of week (Sunday)', () => {
      const result = getStartOfWeek(testDate, 0);
      expect(result.getDay()).toBe(0);
    });
  });

  describe('getEndOfWeek', () => {
    it('should get end of week', () => {
      const result = getEndOfWeek(testDate, 1);
      expect(result.getDay()).toBe(0); // Sunday
    });
  });

  describe('getStartOfMonth', () => {
    it('should get start of month', () => {
      const result = getStartOfMonth(testDate);
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getEndOfMonth', () => {
    it('should get end of month', () => {
      const result = getEndOfMonth(testDate);
      expect(result.getDate()).toBe(31); // March has 31 days
    });
  });

  describe('getStartOfDay', () => {
    it('should get start of day', () => {
      const result = getStartOfDay(testDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('should get end of day', () => {
      const result = getEndOfDay(testDate);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2026-03-19T10:00:00');
      const date2 = new Date('2026-03-19T15:00:00');
      const result = isSameDay(date1, date2);
      expect(result).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2026-03-19');
      const date2 = new Date('2026-03-20');
      const result = isSameDay(date1, date2);
      expect(result).toBe(false);
    });
  });

  describe('parseISODate', () => {
    it('should parse ISO date string', () => {
      const result = parseISODate('2026-03-19T10:00:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2026);
    });

    it('should return null for invalid ISO string', () => {
      const result = parseISODate('invalid');
      expect(result).toBeNull();
    });
  });

  describe('toISODateString', () => {
    it('should convert date to ISO string', () => {
      const result = toISODateString(testDate);
      expect(result).toBe('2026-03-19T10:00:00.000Z');
    });

    it('should handle string input', () => {
      const result = toISODateString('2026-03-19');
      expect(result).toContain('2026-03-19');
    });
  });
});
