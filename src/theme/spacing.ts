/**
 * UnifiedCal スペーシング定義
 *
 * アプリケーション全体で使用されるスペーシング（余白）の定義
 */

// 基本単位（4pxベース）
const BASE_UNIT = 4;

// スペーシング値定義
export const Spacing = {
  xxs: BASE_UNIT * 0.5, // 2px
  xs: BASE_UNIT * 1, // 4px
  sm: BASE_UNIT * 2, // 8px
  md: BASE_UNIT * 3, // 12px
  lg: BASE_UNIT * 4, // 16px
  xl: BASE_UNIT * 5, // 20px
  xxl: BASE_UNIT * 6, // 24px
  xxxl: BASE_UNIT * 8, // 32px
  xxxxl: BASE_UNIT * 12, // 48px
} as const;

// パディング定義（コンポーネント内側の余白）
export const Padding = {
  none: 0,
  xs: Spacing.xs,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
} as const;

// マージン定義（コンポーネント外側の余白）
export const Margin = {
  none: 0,
  xs: Spacing.xs,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
} as const;

// ギャップ定義（要素間の余白）
export const Gap = {
  xs: Spacing.xs,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
} as const;

// 画面パディング（SafeAreaを考慮）
export const ScreenPadding = {
  horizontal: Spacing.lg,
  vertical: Spacing.xl,
  top: Spacing.xxl,
  bottom: Spacing.xl,
  left: Spacing.lg,
  right: Spacing.lg,
} as const;

// カードパディング
export const CardPadding = {
  xs: Spacing.sm,
  sm: Spacing.md,
  md: Spacing.lg,
  lg: Spacing.xl,
} as const;

// ボーダー半径定義
export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

// ボーダー幅定義
export const BorderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 3,
  heavy: 4,
} as const;

// アイコンサイズ定義
export const IconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ボタンサイズ定義
export const ButtonSize = {
  sm: {
    height: 32,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  md: {
    height: 40,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  lg: {
    height: 48,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
} as const;

// 入力フィールドサイズ定義
export const InputSize = {
  sm: {
    height: 36,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  md: {
    height: 44,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  lg: {
    height: 52,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
} as const;

// シャドウ定義（iOS向け）
export const Shadow = {
  xs: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
} as const;

// エレベーション定義（Android向け）
export const Elevation = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
} as const;

// 型定義
export type SpacingName = keyof typeof Spacing;
export type SpacingValue = (typeof Spacing)[SpacingName];
export type BorderRadiusName = keyof typeof BorderRadius;
export type IconSizeName = keyof typeof IconSize;

// ヘルパー関数：動的スペーシング計算
export const multiply = (spacing: SpacingValue, multiplier: number): number => {
  return spacing * multiplier;
};

// ヘルパー関数：レスポンシブスペーシング
export const responsive = (base: SpacingValue, scale: number = 1): number => {
  return base * scale;
};

// エクスポート
export default Spacing;
