/**
 * ErrorBoundary Component
 * Reactコンポーネントのエラーをキャッチして処理する
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  logError,
  saveErrorToStorage,
  createErrorReport,
  getUserFriendlyErrorMessage,
  getErrorSeverity,
  ErrorSeverity,
} from '../../utils/errorHandling';
import { Theme } from '../../theme';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: React.ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * エラー境界コンポーネント
 * 子コンポーネントで発生したエラーをキャッチして、エラー画面を表示する
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * エラーが発生した時に呼ばれる
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * エラー情報をログに記録
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // エラーログを記録
    logError(error, 'React ErrorBoundary', {
      componentStack: errorInfo.componentStack,
    });

    // ローカルストレージに保存
    saveErrorToStorage(error, 'React Component Error');

    // エラーレポートを作成
    const report = createErrorReport(error, 'React Component Error');
    console.error('Error Report:', report);

    // カスタムエラーハンドラーを呼び出し
    this.props.onError?.(error, errorInfo);

    // エラー情報を state に保存
    this.setState({ errorInfo });
  }

  /**
   * エラー画面をリセット
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * デフォルトのエラー画面
   */
  renderDefaultFallback(): ReactNode {
    const { error } = this.state;
    const severity = getErrorSeverity(error);
    const userMessage = getUserFriendlyErrorMessage(error);

    const severityColor = {
      [ErrorSeverity.LOW]: Theme.colors.priorityLow,
      [ErrorSeverity.MEDIUM]: Theme.colors.priorityMedium,
      [ErrorSeverity.HIGH]: Theme.colors.warning,
      [ErrorSeverity.CRITICAL]: Theme.colors.error,
    }[severity];

    return (
      <View style={styles.container}>
        <View style={[styles.errorCard, { borderColor: severityColor }]}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>エラーが発生しました</Text>
          <Text style={styles.errorMessage}>{userMessage}</Text>

          {__DEV__ && error && (
            <View style={styles.debugInfo}>
              <Text style={styles.debugTitle}>Debug Info:</Text>
              <Text style={styles.debugText}>{error.message}</Text>
              <Text style={styles.debugText} numberOfLines={5}>
                {error.stack}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleReset}
          >
            <Text style={styles.retryButtonText}>再試行</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error && errorInfo) {
      // カスタムフォールバックが提供されている場合はそれを使用
      if (fallback) {
        return fallback(error, errorInfo);
      }
      // デフォルトのエラー画面を表示
      return this.renderDefaultFallback();
    }

    // エラーがない場合は子コンポーネントを表示
    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  errorCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 2,
    padding: Theme.spacing.xl,
    maxWidth: 400,
    width: '100%',
    ...Theme.shadow.md,
  },
  errorIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  errorTitle: {
    ...Theme.typography.h2,
    textAlign: 'center',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  errorMessage: {
    ...Theme.typography.body,
    textAlign: 'center',
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  debugInfo: {
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.sm,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  debugTitle: {
    ...Theme.typography.caption,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.error,
    marginBottom: Theme.spacing.xs,
  },
  debugText: {
    ...Theme.typography.caption,
    fontFamily: 'monospace',
    color: Theme.colors.textSecondary,
    fontSize: 10,
  },
  retryButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    alignItems: 'center',
  },
  retryButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.textInverse,
  },
});

export default ErrorBoundary;
