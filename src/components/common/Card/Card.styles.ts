import { StyleSheet, Platform } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Theme } from '../../../theme';

// バリアントスタイル
export const cardVariants: Record<string, ViewStyle> = {
  elevated: {
    ...Platform.select({
      ios: {
        ...Theme.shadow.md,
      },
      android: {
        elevation: Theme.elevation.md,
      },
      default: {
        ...Theme.shadow.md,
      },
    }),
    borderWidth: 0,
  },
  outlined: {
    borderWidth: Theme.borderWidth.thin,
    borderColor: Theme.colors.border,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
      default: {
        shadowOpacity: 0,
      },
    }),
  },
  filled: {
    backgroundColor: Theme.colors.background,
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
      default: {
        shadowOpacity: 0,
      },
    }),
  },
};

// パディングサイズ
export const cardPadding: Record<string, ViewStyle> = {
  xs: {
    padding: Theme.cardPadding.xs,
  },
  sm: {
    padding: Theme.cardPadding.sm,
  },
  md: {
    padding: Theme.cardPadding.md,
  },
  lg: {
    padding: Theme.cardPadding.lg,
  },
};

// 基本スタイル
export const styles = StyleSheet.create({
  // ベーススタイル
  base: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },

  // 無効状態
  disabled: {
    opacity: 0.6,
  },
});

// スタイルを統合したオブジェクトをエクスポート（互換性のため）
export const allStyles = {
  ...styles,
  variants: cardVariants,
  padding: cardPadding,
};
