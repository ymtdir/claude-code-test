/**
 * NotificationHandler
 * 通知のクリックやアクションボタンの処理を管理
 */

import NotificationService from '../services/NotificationService';
import type { NotificationActionType, SnoozeOption } from '../types/reminder';

interface NotificationEvent extends Event {
  notification: Notification;
  action?: string;
}

interface NotificationActionHandler {
  taskId: string;
  reminderId: string;
  action: NotificationActionType;
  handler: () => void | Promise<void>;
}

interface NotificationData {
  tag?: string;
  taskId?: string;
  reminderId?: string;
  action?: string;
}

export class NotificationHandler {
  private static instance: NotificationHandler;
  private actionHandlers: Map<string, NotificationActionHandler[]> = new Map();
  private clickHandlers: Map<string, () => void> = new Map();
  private isInitialized = false;

  private constructor() {
    // シングルトンパターン
  }

  /**
   * シングルトンインスタンスの取得
   */
  static getInstance(): NotificationHandler {
    if (!NotificationHandler.instance) {
      NotificationHandler.instance = new NotificationHandler();
    }
    return NotificationHandler.instance;
  }

  /**
   * 初期化
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Service Workerのメッセージリスナー設定
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });
    }

    // Notification APIのイベントリスナー設定
    if ('Notification' in window) {
      this.setupNotificationListeners();
    }

    this.isInitialized = true;
  }

  /**
   * Service Workerからのメッセージ処理
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'notification-click':
        this.handleNotificationClick(data);
        break;
      case 'notification-action':
        this.handleNotificationAction(data);
        break;
      case 'notification-close':
        this.handleNotificationClose(data);
        break;
      default:
        break;
    }
  }

  /**
   * Notification APIのイベントリスナー設定
   */
  private setupNotificationListeners(): void {
    // グローバルイベントリスナーの設定
    document.addEventListener('notificationclick', this.onNotificationClick);
  }

  /**
   * 通知クリックイベントの処理
   */
  private onNotificationClick = (event: Event): void => {
    const notifEvent = event as NotificationEvent;
    const notification = notifEvent.notification;
    const tag = notification.tag;

    if (tag && this.clickHandlers.has(tag)) {
      const handler = this.clickHandlers.get(tag);
      handler?.();
    }

    // ウィンドウをフォーカス
    this.focusWindow();
    notification.close();
  };

  /**
   * 通知クリックハンドラーの登録
   */
  registerClickHandler(tag: string, handler: () => void): void {
    this.clickHandlers.set(tag, handler);
  }

  /**
   * 通知アクションハンドラーの登録
   */
  registerActionHandler(
    tag: string,
    taskId: string,
    reminderId: string,
    action: NotificationActionType,
    handler: () => void | Promise<void>
  ): void {
    const actionHandler: NotificationActionHandler = {
      taskId,
      reminderId,
      action,
      handler,
    };

    const handlers = this.actionHandlers.get(tag) || [];
    handlers.push(actionHandler);
    this.actionHandlers.set(tag, handlers);
  }

  /**
   * 通知クリックの処理
   */
  private handleNotificationClick(data: NotificationData): void {
    const { tag, taskId } = data;

    // ウィンドウをフォーカス
    this.focusWindow();

    // タスクページへナビゲート
    if (taskId) {
      this.navigateToTask(taskId);
    }

    // カスタムハンドラーの実行
    if (tag && this.clickHandlers.has(tag)) {
      const handler = this.clickHandlers.get(tag);
      handler?.();
    }
  }

  /**
   * 通知アクションの処理
   */
  private async handleNotificationAction(
    data: NotificationData
  ): Promise<void> {
    const { tag, action, taskId, reminderId } = data;

    const handlers = this.actionHandlers.get(tag) || [];
    const handler = handlers.find(
      (h) =>
        h.taskId === taskId &&
        h.reminderId === reminderId &&
        h.action === action
    );

    if (handler) {
      await handler.handler();
    } else {
      // デフォルトアクションの処理
      switch (action as NotificationActionType) {
        case 'complete':
          await this.handleCompleteAction(taskId);
          break;
        case 'snooze':
          await this.handleSnoozeAction(taskId, reminderId);
          break;
        case 'dismiss':
          this.handleDismissAction(reminderId);
          break;
        case 'open':
          this.handleOpenAction(taskId);
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    }
  }

  /**
   * 通知クローズの処理
   */
  private handleNotificationClose(data: NotificationData): void {
    const { tag } = data;
    // クリーンアップ処理
    this.clickHandlers.delete(tag);
    this.actionHandlers.delete(tag);
  }

  /**
   * タスク完了アクションの処理
   */
  private async handleCompleteAction(taskId: string): Promise<void> {
    // Redux storeにアクセスしてタスクを完了
    // この実装は実際のReduxストア構造に依存
    try {
      // タスク完了の処理をここに実装
      console.log(`Completing task: ${taskId}`);

      // 成功通知を表示
      await NotificationService.showNotification('タスクを完了しました', {
        body: 'タスクが正常に完了しました',
        icon: '/favicon.ico',
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  }

  /**
   * スヌーズアクションの処理
   */
  private async handleSnoozeAction(
    taskId: string,
    reminderId: string,
    snoozeMinutes: number = 10
  ): Promise<void> {
    try {
      const snoozeMs = snoozeMinutes * 60 * 1000;
      const snoozeNotificationId = `${taskId}-${reminderId}-snooze`;

      // スヌーズ通知をスケジュール
      NotificationService.scheduleNotification(
        snoozeNotificationId,
        'リマインダー（スヌーズ）',
        {
          body: `${snoozeMinutes}分後に再通知します`,
          icon: '/favicon.ico',
          tag: taskId,
          requireInteraction: true,
        },
        snoozeMs
      );

      // 成功通知を表示
      await NotificationService.showNotification('スヌーズしました', {
        body: `${snoozeMinutes}分後に再度通知します`,
        icon: '/favicon.ico',
      });
    } catch (error) {
      console.error('Failed to snooze reminder:', error);
    }
  }

  /**
   * 却下アクションの処理
   */
  private handleDismissAction(reminderId: string): void {
    // 通知のキャンセル
    NotificationService.cancelScheduledNotification(reminderId);
    console.log(`Dismissed reminder: ${reminderId}`);
  }

  /**
   * 開くアクションの処理
   */
  private handleOpenAction(taskId: string): void {
    this.focusWindow();
    this.navigateToTask(taskId);
  }

  /**
   * スヌーズオプションの選択ダイアログ表示
   */
  async showSnoozeOptions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    taskId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reminderId: string
  ): Promise<SnoozeOption | null> {
    // 実際のUIでは、モーダルやドロップダウンで選択肢を表示
    // ここではダミーの実装
    // 将来的にはtaskIdとreminderIdを使用して適切なUIを表示
    // const options: SnoozeOption[] = [5, 10, 15, 30, 60] as SnoozeOption[];

    // デフォルトで10分を返す
    return 10 as SnoozeOption;
  }

  /**
   * ウィンドウのフォーカス
   */
  private focusWindow(): void {
    if (typeof window !== 'undefined') {
      window.focus();
    }
  }

  /**
   * タスクページへのナビゲーション
   */
  private navigateToTask(taskId: string): void {
    if (typeof window !== 'undefined' && window.location) {
      // React RouterやNext.jsのrouterを使用する場合はここで実装
      // 現在は簡単なハッシュナビゲーション
      window.location.hash = `#/task/${taskId}`;
    }
  }

  /**
   * 全てのハンドラーをクリア
   */
  clearAllHandlers(): void {
    this.clickHandlers.clear();
    this.actionHandlers.clear();
  }

  /**
   * 特定のタグのハンドラーをクリア
   */
  clearHandlers(tag: string): void {
    this.clickHandlers.delete(tag);
    this.actionHandlers.delete(tag);
  }

  /**
   * スヌーズ履歴の管理
   */
  private snoozeHistory: Map<string, Date[]> = new Map();

  /**
   * スヌーズ履歴の追加
   */
  addSnoozeHistory(reminderId: string, snoozeTime: Date): void {
    const history = this.snoozeHistory.get(reminderId) || [];
    history.push(snoozeTime);
    this.snoozeHistory.set(reminderId, history);
  }

  /**
   * スヌーズ履歴の取得
   */
  getSnoozeHistory(reminderId: string): Date[] {
    return this.snoozeHistory.get(reminderId) || [];
  }

  /**
   * スヌーズ回数の取得
   */
  getSnoozeCount(reminderId: string): number {
    return this.getSnoozeHistory(reminderId).length;
  }

  /**
   * スヌーズ履歴のクリア
   */
  clearSnoozeHistory(reminderId?: string): void {
    if (reminderId) {
      this.snoozeHistory.delete(reminderId);
    } else {
      this.snoozeHistory.clear();
    }
  }
}

// シングルトンインスタンスをエクスポート
const notificationHandler = NotificationHandler.getInstance();

// 自動初期化
if (typeof window !== 'undefined') {
  notificationHandler.initialize();
}

export default notificationHandler;
