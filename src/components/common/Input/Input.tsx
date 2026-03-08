import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import type {
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  styles,
  inputWrapperVariants,
  inputWrapperSizes,
  inputSizes,
} from './Input.styles';
import { Theme } from '../../../theme';

// インプットバリアントの型定義
export type InputVariant = 'outlined' | 'filled' | 'underline';
export type InputSize = 'small' | 'medium' | 'large';

// インプットコンポーネントのProps型定義
export interface InputProps extends TextInputProps {
  /**
   * ラベルテキスト
   */
  label?: string;

  /**
   * プレースホルダーテキスト
   */
  placeholder?: string;

  /**
   * インプットのバリアント
   * @default 'outlined'
   */
  variant?: InputVariant;

  /**
   * インプットのサイズ
   * @default 'medium'
   */
  size?: InputSize;

  /**
   * エラーメッセージ
   */
  error?: string;

  /**
   * ヘルパーテキスト
   */
  helperText?: string;

  /**
   * 無効状態
   * @default false
   */
  disabled?: boolean;

  /**
   * 必須フィールドかどうか
   * @default false
   */
  required?: boolean;

  /**
   * 左側のアイコン要素
   */
  leftIcon?: React.ReactNode;

  /**
   * 右側のアイコン要素
   */
  rightIcon?: React.ReactNode;

  /**
   * コンテナのスタイル
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * インプットのスタイル
   */
  inputStyle?: StyleProp<TextStyle>;

  /**
   * ラベルのスタイル
   */
  labelStyle?: StyleProp<TextStyle>;
}

/**
 * Input コンポーネント
 *
 * テキスト入力フィールドを提供する汎用インプットコンポーネント
 *
 * @example
 * ```tsx
 * <Input
 *   label="メールアドレス"
 *   placeholder="email@example.com"
 *   value={email}
 *   onChangeText={setEmail}
 *   error={emailError}
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  variant = 'outlined',
  size = 'medium',
  error,
  helperText,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // フォーカスハンドラー
  const handleFocus = (
    e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]
  ) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // ブラーハンドラー
  const handleBlur = (
    e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]
  ) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // エラー状態を判定
  const hasError = !!error;

  // インプットラッパーのスタイル
  const wrapperStyles = [
    styles.wrapper,
    inputWrapperVariants[variant],
    inputWrapperSizes[size],
    isFocused && styles.focused,
    hasError && styles.error,
    disabled && styles.disabled,
  ];

  // インプットのスタイル
  const inputStyles = [
    styles.input,
    inputSizes[size],
    disabled && styles.inputDisabled,
    inputStyle,
  ];

  // プレースホルダーの色
  const placeholderColor = disabled
    ? Theme.colors.textDisabled
    : Theme.colors.textSecondary;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* ラベル */}
      {label && (
        <Text style={[styles.label, hasError && styles.labelError, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* インプットラッパー */}
      <View style={wrapperStyles}>
        {/* 左アイコン */}
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        {/* テキストインプット */}
        <TextInput
          style={inputStyles}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restProps}
        />

        {/* 右アイコン */}
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {/* エラーメッセージ または ヘルパーテキスト */}
      {(error || helperText) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

// デフォルトエクスポート
export default Input;
