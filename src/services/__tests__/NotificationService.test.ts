/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * NotificationService Unit Tests
 */

import { NotificationService } from '../NotificationService';

// Mock Notification API
global.Notification = jest.fn() as any;
(global.Notification as any).permission = 'default';
(global.Notification as any).requestPermission = jest.fn();

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Reset singleton instance for testing
    (NotificationService as any).instance = undefined;
    service = NotificationService.getInstance();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = NotificationService.getInstance();
      const instance2 = NotificationService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('checkPermission', () => {
    it('should return current permission status', () => {
      (global.Notification as any).permission = 'granted';
      expect(service.checkPermission()).toBe('granted');

      (global.Notification as any).permission = 'denied';
      expect(service.checkPermission()).toBe('denied');

      (global.Notification as any).permission = 'default';
      expect(service.checkPermission()).toBe('default');
    });

    it('should return "denied" if Notification is not supported', () => {
      const originalNotification = global.Notification;
      (global as any).Notification = undefined;

      expect(service.checkPermission()).toBe('denied');

      global.Notification = originalNotification;
    });
  });

  describe('requestPermission', () => {
    it('should request permission and return true when granted', async () => {
      (global.Notification as any).requestPermission.mockResolvedValue(
        'granted'
      );

      const result = await service.requestPermission();

      expect(global.Notification.requestPermission).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when permission denied', async () => {
      (global.Notification as any).requestPermission.mockResolvedValue(
        'denied'
      );

      const result = await service.requestPermission();

      expect(result).toBe(false);
    });

    it('should return false when Notification is not supported', async () => {
      const originalNotification = global.Notification;
      (global as any).Notification = undefined;

      const result = await service.requestPermission();

      expect(result).toBe(false);

      global.Notification = originalNotification;
    });

    it('should handle errors gracefully', async () => {
      (global.Notification as any).requestPermission.mockRejectedValue(
        new Error('Permission error')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.requestPermission();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        '通知権限のリクエストに失敗しました:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('showNotification', () => {
    it('should create notification when permission granted', async () => {
      (global.Notification as any).permission = 'granted';
      const mockNotification = {};
      (global.Notification as any).mockReturnValue(mockNotification);

      const result = await service.showNotification('Test Title', {
        body: 'Test body',
      });

      expect(global.Notification).toHaveBeenCalledWith('Test Title', {
        body: 'Test body',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
      expect(result).toBe(mockNotification);
    });

    it('should return null when permission not granted', async () => {
      (global.Notification as any).permission = 'denied';
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await service.showNotification('Test Title');

      expect(global.Notification).not.toHaveBeenCalled();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('通知権限がありません');

      consoleSpy.mockRestore();
    });

    it('should handle notification creation errors', async () => {
      (global.Notification as any).permission = 'granted';
      (global.Notification as any).mockImplementation(() => {
        throw new Error('Notification error');
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.showNotification('Test Title');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        '通知の表示に失敗しました:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('scheduleNotification', () => {
    it('should schedule notification with delay', () => {
      const showNotificationSpy = jest
        .spyOn(service, 'showNotification')
        .mockResolvedValue(null);

      service.scheduleNotification('test-id', 'Test Title', {}, 5000);

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);

      // Fast-forward time
      jest.advanceTimersByTime(5000);

      expect(showNotificationSpy).toHaveBeenCalledWith('Test Title', {});
    });

    it('should cancel existing notification before scheduling new one', () => {
      const cancelSpy = jest.spyOn(service, 'cancelScheduledNotification');

      service.scheduleNotification('test-id', 'Test 1', {}, 3000);
      service.scheduleNotification('test-id', 'Test 2', {}, 5000);

      expect(cancelSpy).toHaveBeenCalledWith('test-id');
      expect(cancelSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onShow callback when notification is shown', async () => {
      const mockNotification = {} as Notification;
      const onShow = jest.fn();
      jest
        .spyOn(service, 'showNotification')
        .mockResolvedValue(mockNotification);

      service.scheduleNotification('test-id', 'Test', {}, 1000, onShow);

      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // Wait for async operations

      expect(onShow).toHaveBeenCalledWith(mockNotification);
    });
  });

  describe('scheduleNotificationAtTime', () => {
    it('should schedule notification for future time', () => {
      const futureTime = new Date(Date.now() + 10000);
      const scheduleSpy = jest.spyOn(service, 'scheduleNotification');

      const result = service.scheduleNotificationAtTime(
        'test-id',
        'Test',
        {},
        futureTime
      );

      expect(result).toBe(true);
      expect(scheduleSpy).toHaveBeenCalledWith(
        'test-id',
        'Test',
        {},
        expect.any(Number),
        undefined
      );
    });

    it('should return false for past time', () => {
      const pastTime = new Date(Date.now() - 10000);
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = service.scheduleNotificationAtTime(
        'test-id',
        'Test',
        {},
        pastTime
      );

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot schedule notification for past time')
      );

      consoleSpy.mockRestore();
    });

    it('should handle very long delays by re-scheduling', () => {
      const MAX_DELAY = 2147483647;
      const veryFutureTime = new Date(Date.now() + MAX_DELAY + 10000);
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = service.scheduleNotificationAtTime(
        'test-id',
        'Test',
        {},
        veryFutureTime
      );

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Delay exceeds maximum timeout')
      );
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        MAX_DELAY / 2
      );

      consoleSpy.mockRestore();
    });
  });

  describe('cancelScheduledNotification', () => {
    it('should cancel scheduled notification', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      service.scheduleNotification('test-id', 'Test', {}, 5000);
      service.cancelScheduledNotification('test-id');

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should do nothing if notification does not exist', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      service.cancelScheduledNotification('non-existent');

      expect(clearTimeoutSpy).not.toHaveBeenCalled();
    });
  });

  describe('scheduleRepeatingNotification', () => {
    it('should schedule repeating notifications', async () => {
      const showSpy = jest
        .spyOn(service, 'showNotification')
        .mockResolvedValue(null);

      const stopFn = service.scheduleRepeatingNotification(
        'test-id',
        'Repeat',
        { body: 'Test' },
        1000,
        3
      );

      // First notification should be immediate
      await Promise.resolve();
      expect(showSpy).toHaveBeenCalledTimes(1);

      // Advance time for subsequent notifications
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      expect(showSpy).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      expect(showSpy).toHaveBeenCalledTimes(3);

      // Should stop after maxCount
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      expect(showSpy).toHaveBeenCalledTimes(3);

      stopFn(); // Clean up
    });

    it('should return stop function', () => {
      const cancelSpy = jest.spyOn(service, 'cancelScheduledNotification');

      const stopFn = service.scheduleRepeatingNotification(
        'test-id',
        'Repeat',
        {},
        1000
      );

      stopFn();

      expect(cancelSpy).toHaveBeenCalledWith('test-id');
    });
  });

  describe('isScheduled', () => {
    it('should return true if notification is scheduled', () => {
      service.scheduleNotification('test-id', 'Test', {}, 5000);
      expect(service.isScheduled('test-id')).toBe(true);
    });

    it('should return false if notification is not scheduled', () => {
      expect(service.isScheduled('non-existent')).toBe(false);
    });
  });

  describe('getScheduledCount', () => {
    it('should return count of scheduled notifications', () => {
      expect(service.getScheduledCount()).toBe(0);

      service.scheduleNotification('test-1', 'Test 1', {}, 1000);
      expect(service.getScheduledCount()).toBe(1);

      service.scheduleNotification('test-2', 'Test 2', {}, 2000);
      expect(service.getScheduledCount()).toBe(2);

      service.cancelScheduledNotification('test-1');
      expect(service.getScheduledCount()).toBe(1);
    });
  });

  describe('cancelAllScheduledNotifications', () => {
    it('should cancel all scheduled notifications', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      service.scheduleNotification('test-1', 'Test 1', {}, 1000);
      service.scheduleNotification('test-2', 'Test 2', {}, 2000);
      service.scheduleNotification('test-3', 'Test 3', {}, 3000);

      service.cancelAllScheduledNotifications();

      expect(clearTimeoutSpy).toHaveBeenCalledTimes(3);
      expect(service.getScheduledCount()).toBe(0);
    });
  });

  describe('isSupported', () => {
    it('should return true if Notification is supported', () => {
      expect(service.isSupported()).toBe(true);
    });

    it('should return false if Notification is not supported', () => {
      const originalNotification = global.Notification;
      (global as any).Notification = undefined;

      expect(service.isSupported()).toBe(false);

      global.Notification = originalNotification;
    });
  });

  describe('isPermissionGranted', () => {
    it('should return true when permission is granted', () => {
      (global.Notification as any).permission = 'granted';
      expect(service.isPermissionGranted()).toBe(true);
    });

    it('should return false when permission is not granted', () => {
      (global.Notification as any).permission = 'denied';
      expect(service.isPermissionGranted()).toBe(false);

      (global.Notification as any).permission = 'default';
      expect(service.isPermissionGranted()).toBe(false);
    });
  });
});
