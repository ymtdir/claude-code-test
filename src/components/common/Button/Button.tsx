import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import type {
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  styles,
  buttonSizes,
  buttonVariants,
  buttonVariantsDisabled,
  textSizes,
  textVariants,
} from './Button.styles';
import { Theme } from '../../../theme';

// ボタンバリアントの型定義
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'outline'
  | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

// ボタンコンポーネントのProps型定義
export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * ボタンに表示するテキスト
   */
  title: string;

  /**
   * ボタンのバリアント
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * ボタンのサイズ
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * ボタンの無効状態
   * @default false
   */
  disabled?: boolean;

  /**
   * ローディング状態
   * @default false
   */
  loading?: boolean;

  /**
   * フルワイド表示
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 左側のアイコン要素
   */
  leftIcon?: React.ReactNode;

  /**
   * 右側のアイコン要素
   */
  rightIcon?: React.ReactNode;

  /**
   * ボタンのスタイル（カスタマイズ用）
   */
  style?: StyleProp<ViewStyle>;

  /**
   * テキストのスタイル（カスタマイズ用）
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * ボタンがタップされた時のコールバック
   */
  onPress?: () => void;
}

/**
 * Button コンポーネント
 *
 * UnifiedCalアプリ全体で使用される汎用ボタンコンポーネント
 *
 * @example
 * ```tsx
 * <Button
 *   title="保存"
 *   variant="primary"
 *   onPress={handleSave}
 * />
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
  ...restProps
}) => {
  // ボタンの無効状態を判定
  const isDisabled = disabled || loading;

  // バリアントに応じたスタイルを取得
  const buttonStyles = [
    styles.base,
    buttonVariants[variant],
    buttonSizes[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    isDisabled && buttonVariantsDisabled[variant],
    style,
  ];

  // テキストスタイルを取得
  const textStyles = [
    styles.text,
    textVariants[variant],
    textSizes[size],
    isDisabled && styles.textDisabled,
    textStyle,
  ];

  // ローディングインジケーターの色を決定
  const getLoadingColor = () => {
    if (variant === 'primary' || variant === 'danger') {
      return Theme.colors.textInverse;
    }
    return Theme.colors.primary;
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={0.7}
      {...restProps}
    >
      {/* ローディング状態 */}
      {loading && (
        <ActivityIndicator
          size="small"
          color={getLoadingColor()}
          style={styles.loadingIndicator}
        />
      )}

      {/* 左アイコン */}
      {!loading && leftIcon && leftIcon}

      {/* ボタンテキスト */}
      {!loading && (
        <Text style={textStyles} numberOfLines={1}>
          {title}
        </Text>
      )}

      {/* 右アイコン */}
      {!loading && rightIcon && rightIcon}
    </TouchableOpacity>
  );
};

// デフォルトエクスポート
export default Button;
