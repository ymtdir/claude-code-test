import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import type { ViewProps, StyleProp, ViewStyle } from 'react-native';
import { styles, cardVariants, cardPadding } from './Card.styles';

// カードバリアントの型定義
export type CardVariant = 'elevated' | 'outlined' | 'filled';

// カードコンポーネントのProps型定義
export interface CardProps extends ViewProps {
  /**
   * カードの子要素
   */
  children: React.ReactNode;

  /**
   * カードのバリアント
   * @default 'elevated'
   */
  variant?: CardVariant;

  /**
   * タップ可能かどうか
   * @default false
   */
  pressable?: boolean;

  /**
   * タップ時のコールバック
   */
  onPress?: () => void;

  /**
   * パディングサイズ
   * @default 'md'
   */
  padding?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * カードのスタイル（カスタマイズ用）
   */
  style?: StyleProp<ViewStyle>;

  /**
   * 無効状態
   * @default false
   */
  disabled?: boolean;
}

/**
 * Card コンポーネント
 *
 * コンテンツをグループ化し、視覚的に分離するためのカードコンポーネント
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="md">
 *   <Text>カードの内容</Text>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  pressable = false,
  onPress,
  padding = 'md',
  style,
  disabled = false,
  ...restProps
}) => {
  // カードのスタイルを組み合わせる
  const cardStyles = [
    styles.base,
    cardVariants[variant],
    cardPadding[padding],
    disabled && styles.disabled,
    style,
  ];

  // タップ可能な場合はTouchableOpacityを使用
  if (pressable && onPress) {
    // TouchableOpacityに渡すpropsを限定
    const { onBlur, onFocus, ...touchableProps } = restProps as any;
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // タップ不可の場合は通常のViewを使用
  return (
    <View style={cardStyles} {...restProps}>
      {children}
    </View>
  );
};

// デフォルトエクスポート
export default Card;
