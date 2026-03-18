/**
 * Global Error Handler
 * グローバルなエラーハンドリングの設定
 */

import {
  logError,
  saveErrorToStorage,
  createErrorReport,
  ErrorType,
  ReminderError,
} from './errorHandling';

/**
 * グローバルエラーハンドラーの設定
 */
export function setupGlobalErrorHandler(): void {
  // 未処理のエラーをキャッチ
  if (typeof window !== 'undefined') {
    // ブラウザ環境の場合
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
  }
}

/**
 * グローバルエラーハンドラーを削除
 */
export function teardownGlobalErrorHandler(): void {
  if (typeof window !== 'undefined') {
    window.removeEventListener('error', handleGlobalError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }
}

/**
 * グローバルエラーの処理
 */
function handleGlobalError(event: ErrorEvent): void {
  const { error, message, filename, lineno, colno } = event;

  // エラー情報をログに記録
  logError(error || message, 'Global Error', {
    filename,
    lineno,
    colno,
  });

  // ストレージに保存
  saveErrorToStorage(error || message, 'Global Error');

  // エラーレポートを作成
  const report = createErrorReport(error || message, 'Global Error');
  console.error('Global Error Report:', report);

  // 通知関連のエラーの場合、特別な処理を行う
  if (
    error instanceof ReminderError &&
    (error.type === ErrorType.NOTIFICATION_PERMISSION ||
      error.type === ErrorType.NOTIFICATION_DISPLAY)
  ) {
    // 通知エラーの場合はユーザーに通知設定の確認を促す
    showNotificationErrorHint();
  }
}

/**
 * 未処理のPromiseリジェクションの処理
 */
function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  const { reason, promise } = event;

  // エラー情報をログに記録
  logError(reason, 'Unhandled Promise Rejection', {
    promise: promise.toString(),
  });

  // ストレージに保存
  saveErrorToStorage(reason, 'Unhandled Promise Rejection');

  // エラーレポートを作成
  const report = createErrorReport(reason, 'Unhandled Promise Rejection');
  console.error('Unhandled Rejection Report:', report);

  // デフォルトのエラー処理を防ぐ
  event.preventDefault();
}

/**
 * 通知エラーのヒントを表示
 */
function showNotificationErrorHint(): void {
  // コンソールにヒントを表示
  console.info(
    '%c通知が正しく機能していない可能性があります',
    'color: orange; font-weight: bold'
  );
  console.info(
    '以下を確認してください:\n' +
      '1. ブラウザの通知設定を確認\n' +
      '2. サイトの通知権限を確認\n' +
      '3. デバイスの通知設定を確認'
  );
}

/**
 * エラー報告のためのAPIコール（将来の実装用）
 */
export async function reportErrorToServer(
  error: unknown,
  context?: string
): Promise<void> {
  const report = createErrorReport(error, context);

  // 本番環境でのみレポートを送信
  if (process.env.NODE_ENV === 'production') {
    try {
      // TODO: エラー報告APIのエンドポイントを実装
      console.log('Error would be reported to server:', report);

      // 例:
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(report),
      // });
    } catch (reportError) {
      // レポート送信自体が失敗した場合は、ログに記録するのみ
      console.error('Failed to report error to server:', reportError);
    }
  }
}

/**
 * デバッグ用：保存されたエラーを表示
 */
export function displaySavedErrors(): void {
  try {
    const errors = JSON.parse(localStorage.getItem('reminder_errors') || '[]');
    console.group('%cSaved Errors', 'color: red; font-weight: bold');
    errors.forEach((error: unknown, index: number) => {
      const errorObj = error as {
        timestamp?: string;
        type?: string;
        severity?: string;
        message?: string;
        context?: string;
        stack?: string;
      };
      console.group(`Error ${index + 1}`);
      console.log('Timestamp:', errorObj.timestamp);
      console.log('Type:', errorObj.type);
      console.log('Severity:', errorObj.severity);
      console.log('Message:', errorObj.message);
      console.log('Context:', errorObj.context);
      if (errorObj.stack) {
        console.log('Stack:', errorObj.stack);
      }
      console.groupEnd();
    });
    console.groupEnd();
  } catch (e) {
    console.error('Failed to display saved errors:', e);
  }
}

/**
 * エラーハンドリングの初期化
 */
export function initializeErrorHandling(): void {
  setupGlobalErrorHandler();

  // 開発環境でのデバッグヘルパー
  if (__DEV__ || process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).displaySavedErrors = displaySavedErrors;
    console.info(
      '%cError debugging enabled. Use window.displaySavedErrors() to view saved errors.',
      'color: green'
    );
  }
}

// エクスポート
export default {
  setupGlobalErrorHandler,
  teardownGlobalErrorHandler,
  reportErrorToServer,
  displaySavedErrors,
  initializeErrorHandling,
};
