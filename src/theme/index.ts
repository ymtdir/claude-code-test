/**
 * UnifiedCal テーマ統合
 *
 * テーマ関連のすべての要素を統合してエクスポート
 */

// 個別のテーマ要素をインポート
import Colors, {
  type ColorName,
  type ColorValue,
  type ThemeColors,
  withOpacity,
  lightTheme,
} from './colors';

import Typography, {
  type TypographyStyle,
  type FontSizeName,
  type FontWeightName,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  createTextStyle,
} from './typography';

import Spacing, {
  type SpacingName,
  type SpacingValue,
  type BorderRadiusName,
  type IconSizeName,
  Padding,
  Margin,
  Gap,
  ScreenPadding,
  CardPadding,
  BorderRadius,
  BorderWidth,
  IconSize,
  ButtonSize,
  InputSize,
  Shadow,
  Elevation,
  multiply,
  responsive,
} from './spacing';

// 統合テーマオブジェクト
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  padding: Padding,
  margin: Margin,
  gap: Gap,
  screenPadding: ScreenPadding,
  cardPadding: CardPadding,
  borderRadius: BorderRadius,
  borderWidth: BorderWidth,
  iconSize: IconSize,
  buttonSize: ButtonSize,
  inputSize: InputSize,
  shadow: Shadow,
  elevation: Elevation,
  // フォント関連
  fontFamily: FontFamily,
  fontSize: FontSize,
  fontWeight: FontWeight,
  lineHeight: LineHeight,
  letterSpacing: LetterSpacing,
} as const;

// 型定義のエクスポート
export type {
  ColorName,
  ColorValue,
  ThemeColors,
  TypographyStyle,
  FontSizeName,
  FontWeightName,
  SpacingName,
  SpacingValue,
  BorderRadiusName,
  IconSizeName,
};

// ヘルパー関数のエクスポート
export { withOpacity, createTextStyle, multiply, responsive };

// テーマプリセットのエクスポート
export { lightTheme };

// 個別要素の再エクスポート（互換性のため）
export { Colors, Typography, Spacing };

// デフォルトエクスポート
export default Theme;
