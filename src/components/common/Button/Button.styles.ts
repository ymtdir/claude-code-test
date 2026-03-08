import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../../theme';

// サイズバリエーション
export const buttonSizes: Record<string, ViewStyle> = {
  small: {
    height: Theme.buttonSize.sm.height,
    paddingHorizontal: Theme.buttonSize.sm.paddingHorizontal,
    paddingVertical: Theme.buttonSize.sm.paddingVertical,
  },
  medium: {
    height: Theme.buttonSize.md.height,
    paddingHorizontal: Theme.buttonSize.md.paddingHorizontal,
    paddingVertical: Theme.buttonSize.md.paddingVertical,
  },
  large: {
    height: Theme.buttonSize.lg.height,
    paddingHorizontal: Theme.buttonSize.lg.paddingHorizontal,
    paddingVertical: Theme.buttonSize.lg.paddingVertical,
  },
};

// バリアントスタイル
export const buttonVariants: Record<string, ViewStyle> = {
  primary: {
    backgroundColor: Theme.colors.primary,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: Theme.colors.secondary,
    borderWidth: 0,
  },
  danger: {
    backgroundColor: Theme.colors.error,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: Theme.borderWidth.thin,
    borderColor: Theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
};

// バリアント別の無効状態
export const buttonVariantsDisabled: Record<string, ViewStyle> = {
  primary: {
    backgroundColor: Theme.colors.textDisabled,
  },
  secondary: {
    backgroundColor: Theme.colors.textDisabled,
  },
  danger: {
    backgroundColor: Theme.colors.textDisabled,
  },
  outline: {
    borderColor: Theme.colors.textDisabled,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
};

// テキストサイズバリエーション
export const textSizes: Record<string, TextStyle> = {
  small: {
    ...Theme.typography.buttonSmall,
  },
  medium: {
    ...Theme.typography.button,
  },
  large: {
    ...Theme.typography.button,
    fontSize: Theme.fontSize.lg,
  },
};

// テキストバリアントスタイル
export const textVariants: Record<string, TextStyle> = {
  primary: {
    color: Theme.colors.textInverse,
  },
  secondary: {
    color: Theme.colors.textInverse,
  },
  danger: {
    color: Theme.colors.textInverse,
  },
  outline: {
    color: Theme.colors.primary,
  },
  ghost: {
    color: Theme.colors.primary,
  },
};

// 基本スタイル
export const styles = StyleSheet.create({
  // ベーススタイル
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadow.sm,
  },

  // フルワイドスタイル
  fullWidth: {
    width: '100%',
  },

  // 無効状態スタイル
  disabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },

  // テキストスタイル
  text: {
    ...Theme.typography.button,
    textAlign: 'center',
  },

  // 無効状態のテキスト
  textDisabled: {
    color: Theme.colors.textDisabled,
  },

  // ローディングインジケーター
  loadingIndicator: {
    marginRight: Theme.spacing.sm,
  },
});

// スタイルを統合したオブジェクトをエクスポート（互換性のため）
export const allStyles = {
  ...styles,
  sizes: buttonSizes,
  variants: buttonVariants,
  variantsDisabled: buttonVariantsDisabled,
  textSizes,
  textVariants,
};
