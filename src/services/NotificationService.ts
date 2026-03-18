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
   * @param onShow 通知が表示された時のコールバック
   */
  scheduleNotification(
    notificationId: string,
    title: string,
    options: NotificationOptions,
    delayMs: number,
    onShow?: (notification: Notification | null) => void
  ): void {
    // 既存のスケジュールをキャンセル
    this.cancelScheduledNotification(notificationId);

    const timeoutId = setTimeout(async () => {
      const notification = await this.showNotification(title, options);
      this.scheduledNotifications.delete(notificationId);
      onShow?.(notification);
    }, delayMs);

    this.scheduledNotifications.set(notificationId, timeoutId);
  }

  /**
   * 時刻を指定して通知をスケジュール
   * @param notificationId 通知の一意ID
   * @param title 通知のタイトル
   * @param options 通知のオプション
   * @param targetDate 通知を表示する日時
   * @param onShow 通知が表示された時のコールバック
   * @returns スケジュールが成功したかどうか
   */
  scheduleNotificationAtTime(
    notificationId: string,
    title: string,
    options: NotificationOptions,
    targetDate: Date,
    onShow?: (notification: Notification | null) => void
  ): boolean {
    const now = Date.now();
    const targetTime = targetDate.getTime();
    const delayMs = targetTime - now;

    // 過去の時刻の場合はスケジュールしない
    if (delayMs <= 0) {
      console.warn(`Cannot schedule notification for past time: ${targetDate}`);
      return false;
    }

    // 最大遅延時間のチェック（JavaScriptのsetTimeoutの制限）
    const MAX_DELAY = 2147483647; // 約24.8日
    if (delayMs > MAX_DELAY) {
      console.warn(`Delay exceeds maximum timeout: ${delayMs}ms`);
      // 長期間の場合は定期的に再スケジュール
      const intermediateDelay = MAX_DELAY / 2;
      const timeoutId = setTimeout(() => {
        this.scheduleNotificationAtTime(
          notificationId,
          title,
          options,
          targetDate,
          onShow
        );
      }, intermediateDelay);
      this.scheduledNotifications.set(notificationId, timeoutId);
      return true;
    }

    this.scheduleNotification(notificationId, title, options, delayMs, onShow);
    return true;
  }

  /**
   * 繰り返し通知をスケジュール
   * @param notificationId 通知の一意ID
   * @param title 通知のタイトル
   * @param options 通知のオプション
   * @param interval 繰り返し間隔（ミリ秒）
   * @param maxCount 最大繰り返し回数（省略時は無限）
   * @returns 停止関数
   */
  scheduleRepeatingNotification(
    notificationId: string,
    title: string,
    options: NotificationOptions,
    interval: number,
    maxCount?: number
  ): () => void {
    let count = 0;

    const showRepeatingNotification = async () => {
      if (maxCount && count >= maxCount) {
        this.cancelScheduledNotification(notificationId);
        return;
      }

      await this.showNotification(title, {
        ...options,
        body: `${options.body} (${count + 1}/${maxCount || '∞'})`,
      });

      count++;

      // 次の通知をスケジュール
      const timeoutId = setTimeout(showRepeatingNotification, interval);
      this.scheduledNotifications.set(notificationId, timeoutId);
    };

    // 最初の通知を即座に表示
    showRepeatingNotification();

    // 停止関数を返す
    return () => this.cancelScheduledNotification(notificationId);
  }

  /**
   * 毎日指定時刻に繰り返す通知をスケジュール
   * @param notificationId 通知の一意ID
   * @param title 通知のタイトル
   * @param options 通知のオプション
   * @param hour 時（0-23）
   * @param minute 分（0-59）
   * @returns 停止関数
   */
  scheduleDailyNotification(
    notificationId: string,
    title: string,
    options: NotificationOptions,
    hour: number,
    minute: number
  ): () => void {
    const scheduleNext = () => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(hour, minute, 0, 0);

      // 今日の指定時刻が過ぎていたら明日にセット
      if (targetTime.getTime() <= now.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const delayMs = targetTime.getTime() - now.getTime();

      const timeoutId = setTimeout(async () => {
        await this.showNotification(title, options);
        // 次の通知をスケジュール
        scheduleNext();
      }, delayMs);

      this.scheduledNotifications.set(notificationId, timeoutId);
    };

    scheduleNext();

    // 停止関数を返す
    return () => this.cancelScheduledNotification(notificationId);
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
   * 週次で指定曜日・時刻に繰り返す通知をスケジュール
   * @param notificationId 通知の一意ID
   * @param title 通知のタイトル
   * @param options 通知のオプション
   * @param dayOfWeek 曜日（0=日曜, 6=土曜）
   * @param hour 時（0-23）
   * @param minute 分（0-59）
   * @returns 停止関数
   */
  scheduleWeeklyNotification(
    notificationId: string,
    title: string,
    options: NotificationOptions,
    dayOfWeek: number,
    hour: number,
    minute: number
  ): () => void {
    const scheduleNext = () => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(hour, minute, 0, 0);

      // 指定曜日になるまで日付を進める
      while (
        targetTime.getDay() !== dayOfWeek ||
        targetTime.getTime() <= now.getTime()
      ) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const delayMs = targetTime.getTime() - now.getTime();

      const timeoutId = setTimeout(async () => {
        await this.showNotification(title, options);
        // 次の通知をスケジュール
        scheduleNext();
      }, delayMs);

      this.scheduledNotifications.set(notificationId, timeoutId);
    };

    scheduleNext();

    // 停止関数を返す
    return () => this.cancelScheduledNotification(notificationId);
  }

  /**
   * 月次で指定日・時刻に繰り返す通知をスケジュール
   * @param notificationId 通知の一意ID
   * @param title 通知のタイトル
   * @param options 通知のオプション
   * @param dayOfMonth 日（1-31）
   * @param hour 時（0-23）
   * @param minute 分（0-59）
   * @returns 停止関数
   */
  scheduleMonthlyNotification(
    notificationId: string,
    title: string,
    options: NotificationOptions,
    dayOfMonth: number,
    hour: number,
    minute: number
  ): () => void {
    const scheduleNext = () => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setDate(dayOfMonth);
      targetTime.setHours(hour, minute, 0, 0);

      // 今月の指定日が過ぎていたら来月にセット
      if (targetTime.getTime() <= now.getTime()) {
        targetTime.setMonth(targetTime.getMonth() + 1);
      }

      // 月末の調整（例：31日指定で30日までしかない月の場合）
      while (targetTime.getDate() !== dayOfMonth) {
        targetTime.setDate(0); // 前月の最終日
        targetTime.setMonth(targetTime.getMonth() + 2); // 翌月に進める
        targetTime.setDate(dayOfMonth);
      }

      const delayMs = targetTime.getTime() - now.getTime();

      const timeoutId = setTimeout(async () => {
        await this.showNotification(title, options);
        // 次の通知をスケジュール
        scheduleNext();
      }, delayMs);

      this.scheduledNotifications.set(notificationId, timeoutId);
    };

    scheduleNext();

    // 停止関数を返す
    return () => this.cancelScheduledNotification(notificationId);
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
   * 通知がスケジュールされているかチェック
   * @param notificationId 通知の一意ID
   * @returns スケジュールされているかどうか
   */
  isScheduled(notificationId: string): boolean {
    return this.scheduledNotifications.has(notificationId);
  }

  /**
   * スケジュールされた通知の数を取得
   * @returns 通知の数
   */
  getScheduledCount(): number {
    return this.scheduledNotifications.size;
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
