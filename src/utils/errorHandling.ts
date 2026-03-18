/**
 * Error Handling Utilities
 * エラーハンドリングのためのユーティリティ関数
 */

/**
 * エラータイプの定義
 */
export enum ErrorType {
  NOTIFICATION_PERMISSION = 'NOTIFICATION_PERMISSION',
  NOTIFICATION_DISPLAY = 'NOTIFICATION_DISPLAY',
  NOTIFICATION_SCHEDULE = 'NOTIFICATION_SCHEDULE',
  REMINDER_CREATE = 'REMINDER_CREATE',
  REMINDER_UPDATE = 'REMINDER_UPDATE',
  REMINDER_DELETE = 'REMINDER_DELETE',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

/**
 * カスタムエラークラス
 */
export class ReminderError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ReminderError';
  }
}

/**
 * エラーメッセージのマッピング
 */
const errorMessages: Record<ErrorType, string> = {
  [ErrorType.NOTIFICATION_PERMISSION]: '通知の権限がありません',
  [ErrorType.NOTIFICATION_DISPLAY]: '通知の表示に失敗しました',
  [ErrorType.NOTIFICATION_SCHEDULE]: '通知のスケジューリングに失敗しました',
  [ErrorType.REMINDER_CREATE]: 'リマインダーの作成に失敗しました',
  [ErrorType.REMINDER_UPDATE]: 'リマインダーの更新に失敗しました',
  [ErrorType.REMINDER_DELETE]: 'リマインダーの削除に失敗しました',
  [ErrorType.STORAGE]: 'ストレージへの保存に失敗しました',
  [ErrorType.NETWORK]: 'ネットワークエラーが発生しました',
  [ErrorType.UNKNOWN]: '予期しないエラーが発生しました',
};

/**
 * エラーメッセージを取得
 */
export function getErrorMessage(type: ErrorType): string {
  return errorMessages[type] || errorMessages[ErrorType.UNKNOWN];
}

/**
 * エラーをログに記録
 */
export function logError(
  error: unknown,
  context?: string,
  additionalInfo?: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    ...additionalInfo,
  };

  if (error instanceof ReminderError) {
    console.error('[ReminderError]', {
      ...errorInfo,
      type: error.type,
      message: error.message,
      originalError: error.originalError,
    });
  } else if (error instanceof Error) {
    console.error('[Error]', {
      ...errorInfo,
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error('[UnknownError]', {
      ...errorInfo,
      error,
    });
  }
}

/**
 * エラーハンドリングのラッパー関数
 * 非同期関数でエラーをキャッチしてログを記録
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorType: ErrorType,
  context?: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    logError(error, context, { errorType });
    throw new ReminderError(errorType, getErrorMessage(errorType), error);
  }
}

/**
 * 同期関数用のエラーハンドリングラッパー
 */
export function withSyncErrorHandling<T>(
  fn: () => T,
  errorType: ErrorType,
  context?: string
): T | null {
  try {
    return fn();
  } catch (error) {
    logError(error, context, { errorType });
    throw new ReminderError(errorType, getErrorMessage(errorType), error);
  }
}

/**
 * リトライ機能付きエラーハンドリング
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000,
  errorType = ErrorType.UNKNOWN
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      logError(error, `Attempt ${attempt}/${maxRetries} failed`, {
        attempt,
        maxRetries,
      });

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw new ReminderError(
    errorType,
    `Failed after ${maxRetries} attempts`,
    lastError
  );
}

/**
 * ユーザー向けエラーメッセージの生成
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ReminderError) {
    return getErrorMessage(error.type);
  }

  if (error instanceof Error) {
    // 特定のエラーメッセージをチェック
    if (error.message.includes('permission')) {
      return getErrorMessage(ErrorType.NOTIFICATION_PERMISSION);
    }
    if (error.message.includes('network')) {
      return getErrorMessage(ErrorType.NETWORK);
    }
    if (error.message.includes('storage')) {
      return getErrorMessage(ErrorType.STORAGE);
    }
  }

  return getErrorMessage(ErrorType.UNKNOWN);
}

/**
 * エラーの重要度を判定
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export function getErrorSeverity(error: unknown): ErrorSeverity {
  if (error instanceof ReminderError) {
    switch (error.type) {
      case ErrorType.NOTIFICATION_PERMISSION:
        return ErrorSeverity.MEDIUM;
      case ErrorType.NOTIFICATION_DISPLAY:
      case ErrorType.NOTIFICATION_SCHEDULE:
        return ErrorSeverity.LOW;
      case ErrorType.REMINDER_CREATE:
      case ErrorType.REMINDER_UPDATE:
      case ErrorType.REMINDER_DELETE:
        return ErrorSeverity.HIGH;
      case ErrorType.STORAGE:
      case ErrorType.NETWORK:
        return ErrorSeverity.CRITICAL;
      default:
        return ErrorSeverity.MEDIUM;
    }
  }

  return ErrorSeverity.MEDIUM;
}

/**
 * エラーレポートの生成
 */
export interface ErrorReport {
  timestamp: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  context?: string;
  stack?: string;
  userAgent?: string;
  url?: string;
}

export function createErrorReport(
  error: unknown,
  context?: string
): ErrorReport {
  const timestamp = new Date().toISOString();
  let type = ErrorType.UNKNOWN;
  let message = 'Unknown error';
  let stack: string | undefined;

  if (error instanceof ReminderError) {
    type = error.type;
    message = error.message;
    stack = error.stack;
  } else if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  } else if (typeof error === 'string') {
    message = error;
  }

  return {
    timestamp,
    type,
    severity: getErrorSeverity(error),
    message,
    context,
    stack,
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };
}

/**
 * エラーをローカルストレージに保存（デバッグ用）
 */
export function saveErrorToStorage(error: unknown, context?: string): void {
  try {
    const report = createErrorReport(error, context);
    const errors = JSON.parse(localStorage.getItem('reminder_errors') || '[]');
    errors.push(report);

    // 最新の10件のみ保持
    if (errors.length > 10) {
      errors.splice(0, errors.length - 10);
    }

    localStorage.setItem('reminder_errors', JSON.stringify(errors));
  } catch {
    // ストレージへの保存に失敗した場合は何もしない
  }
}

/**
 * 保存されたエラーを取得
 */
export function getSavedErrors(): ErrorReport[] {
  try {
    return JSON.parse(localStorage.getItem('reminder_errors') || '[]');
  } catch {
    return [];
  }
}

/**
 * 保存されたエラーをクリア
 */
export function clearSavedErrors(): void {
  try {
    localStorage.removeItem('reminder_errors');
  } catch {
    // クリアに失敗した場合は何もしない
  }
}
