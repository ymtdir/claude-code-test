import { StyleSheet, Platform } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Theme } from '../../../theme';

// バリアントスタイル
export const headerVariants: Record<string, ViewStyle> = {
  default: {
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border,
  },
  primary: {
    backgroundColor: Theme.colors.primary,
    borderBottomWidth: 0,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
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

// 基本スタイル
export const styles = StyleSheet.create({
  // コンテナスタイル
  container: {
    width: '100%',
    zIndex: 100,
    ...Platform.select({
      ios: {
        ...Theme.shadow.sm,
      },
      android: {
        elevation: Theme.elevation.sm,
      },
      default: {
        ...Theme.shadow.sm,
      },
    }),
  },

  // コンテンツコンテナ
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
  },

  // 左側要素
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 50,
  },

  // 中央要素
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.sm,
  },

  // 右側要素
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 50,
  },

  // タイトルスタイル
  title: {
    ...Theme.typography.h4,
    textAlign: 'center',
  },

  // サブタイトルスタイル
  subtitle: {
    ...Theme.typography.caption,
    textAlign: 'center',
    marginTop: Theme.spacing.xxs,
  },

  // 戻るボタンスタイル
  backButton: {
    padding: Theme.spacing.xs,
  },
});

// スタイルを統合したオブジェクトをエクスポート（互換性のため）
export const allStyles = {
  ...styles,
  variants: headerVariants,
};
