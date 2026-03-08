/**
 * UnifiedCal タイポグラフィ定義
 *
 * アプリケーション全体で使用されるテキストスタイルの定義
 */

import { Platform } from 'react-native';
import type { TextStyle } from 'react-native';

// フォントファミリー定義
export const FontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
    default: 'System',
  }),
} as const;

// フォントサイズ定義
export const FontSize = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// フォントウェイト定義
export const FontWeight = {
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  heavy: '900' as TextStyle['fontWeight'],
} as const;

// 行高定義
export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

// レター・スペーシング定義
export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// タイポグラフィスタイル定義
export const Typography = {
  // 見出し
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xxxl * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  } as TextStyle,

  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xxl * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  } as TextStyle,

  h3: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.xl * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  h4: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.lg * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  // 本文
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.lg * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  // ボタンテキスト
  button: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.md * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,

  buttonSmall: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.sm * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,

  // キャプション・ラベル
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.xs * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.sm * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,

  // オーバーライン
  overline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.xxs * LineHeight.normal,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,

  // リンク
  link: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
    textDecorationLine: 'underline' as TextStyle['textDecorationLine'],
  } as TextStyle,

  // コード・モノスペース
  code: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,
};

// 型定義
export type TypographyStyle = keyof typeof Typography;
export type FontSizeName = keyof typeof FontSize;
export type FontWeightName = keyof typeof FontWeight;

// ヘルパー関数：カスタムテキストスタイル作成
export const createTextStyle = (
  fontSize: number,
  fontWeight: TextStyle['fontWeight'] = FontWeight.regular,
  lineHeight?: number,
  letterSpacing?: number
): TextStyle => ({
  fontSize,
  fontWeight,
  lineHeight: lineHeight || fontSize * LineHeight.normal,
  letterSpacing: letterSpacing || LetterSpacing.normal,
});

// エクスポート
export default Typography;
