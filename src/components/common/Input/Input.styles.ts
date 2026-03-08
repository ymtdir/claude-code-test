import { StyleSheet, Platform } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../../theme';

// バリアントスタイル
export const inputWrapperVariants: Record<string, ViewStyle> = {
  outlined: {
    borderWidth: Theme.borderWidth.thin,
    borderColor: Theme.colors.border,
  },
  filled: {
    backgroundColor: Theme.colors.background,
    borderWidth: 0,
  },
  underline: {
    borderBottomWidth: Theme.borderWidth.thin,
    borderBottomColor: Theme.colors.border,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
};

// サイズスタイル
export const inputWrapperSizes: Record<string, ViewStyle> = {
  small: {
    height: Theme.inputSize.sm.height,
  },
  medium: {
    height: Theme.inputSize.md.height,
  },
  large: {
    height: Theme.inputSize.lg.height,
  },
};

// インプットサイズスタイル
export const inputSizes: Record<string, TextStyle> = {
  small: {
    paddingHorizontal: Theme.inputSize.sm.paddingHorizontal,
    paddingVertical: Theme.inputSize.sm.paddingVertical,
    fontSize: Theme.fontSize.sm,
  },
  medium: {
    paddingHorizontal: Theme.inputSize.md.paddingHorizontal,
    paddingVertical: Theme.inputSize.md.paddingVertical,
    fontSize: Theme.fontSize.md,
  },
  large: {
    paddingHorizontal: Theme.inputSize.lg.paddingHorizontal,
    paddingVertical: Theme.inputSize.lg.paddingVertical,
    fontSize: Theme.fontSize.lg,
  },
};

// 基本スタイル
export const styles = StyleSheet.create({
  // コンテナスタイル
  container: {
    marginVertical: Theme.spacing.sm,
  },

  // ラベルスタイル
  label: {
    ...Theme.typography.label,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },

  labelError: {
    color: Theme.colors.error,
  },

  required: {
    color: Theme.colors.error,
  },

  // インプットラッパー
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
  },

  // インプットスタイル
  input: {
    flex: 1,
    ...Theme.typography.body,
    color: Theme.colors.textPrimary,
    ...Platform.select({
      android: {
        padding: 0, // Androidのデフォルトパディングを削除
      },
    }),
  },

  inputDisabled: {
    color: Theme.colors.textDisabled,
  },

  // フォーカス状態
  focused: {
    borderColor: Theme.colors.primary,
    borderWidth: Theme.borderWidth.medium,
  },

  // エラー状態
  error: {
    borderColor: Theme.colors.error,
    borderWidth: Theme.borderWidth.medium,
  },

  // 無効状態
  disabled: {
    backgroundColor: Theme.colors.background,
    opacity: 0.6,
  },

  // アイコンスタイル
  iconLeft: {
    marginLeft: Theme.spacing.md,
    marginRight: Theme.spacing.xs,
  },

  iconRight: {
    marginLeft: Theme.spacing.xs,
    marginRight: Theme.spacing.md,
  },

  // ヘルパーテキスト・エラーテキスト
  helperText: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
    marginHorizontal: Theme.spacing.xs,
  },

  errorText: {
    color: Theme.colors.error,
  },
});

// スタイルを統合したオブジェクトをエクスポート（互換性のため）
export const allStyles = {
  ...styles,
  wrapperVariants: inputWrapperVariants,
  wrapperSizes: inputWrapperSizes,
  inputSizes,
};
