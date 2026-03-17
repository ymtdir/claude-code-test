/**
 * NotificationService
 * ブラウザのNotification APIを使用した通知管理サービス
 */

export class NotificationService {
  private static instance: NotificationService;
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    // シングルトンパターン
  }

  /**
   * シングルトンインスタンスの取得
   */
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * 通知権限の状態を確認
   * @returns 権限の状態
   */
  checkPermission(): NotificationPermission {
    if (!('Notification' in window)) {
      console.warn('このブラウザは通知機能をサポートしていません');
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * 通知権限をリクエスト
   * @returns 権限が許可されたかどうか
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('このブラウザは通知機能をサポートしていません');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('通知権限のリクエストに失敗しました:', error);
      return false;
    }
  }

  /**
   * 通知を表示
   * @param title 通知のタイトル
   * @param options 通知のオプション
   */
  async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<Notification | null> {
    const permission = this.checkPermission();

    if (permission !== 'granted') {
      console.warn('通知権限がありません');
      return null;
    }

    try {
      const notification = new Notification(title, {
        ...options,
        icon: options?.icon || '/favicon.ico',
        badge: options?.badge || '/favicon.ico',
      });

      return notification;
    } catch (error) {
      console.error('通知の表示に失敗しました:', error);
      return null;
    }
  }

  /**
   * 通知をスケジュール
   * @param notificationId 通知の一意ID
   * @param title 通知のタイトル
   * @param options 通知のオプション
   * @param delayMs 遅延時間（ミリ秒）
   */
  scheduleNotification(
    notificationId: string,
    title: string,
    options: NotificationOptions,
    delayMs: number
  ): void {
    // 既存のスケジュールをキャンセル
    this.cancelScheduledNotification(notificationId);

    const timeoutId = setTimeout(() => {
      this.showNotification(title, options);
      this.scheduledNotifications.delete(notificationId);
    }, delayMs);

    this.scheduledNotifications.set(notificationId, timeoutId);
  }

  /**
   * スケジュールされた通知をキャンセル
   * @param notificationId 通知の一意ID
   */
  cancelScheduledNotification(notificationId: string): void {
    const timeoutId = this.scheduledNotifications.get(notificationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(notificationId);
    }
  }

  /**
   * すべてのスケジュールされた通知をキャンセル
   */
  cancelAllScheduledNotifications(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
  }

  /**
   * 通知がサポートされているかチェック
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * 権限が許可されているかチェック
   */
  isPermissionGranted(): boolean {
    return this.checkPermission() === 'granted';
  }
}

export default NotificationService.getInstance();
