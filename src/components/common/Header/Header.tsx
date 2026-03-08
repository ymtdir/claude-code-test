import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, headerVariants } from './Header.styles';
import { Icon, IconNames } from '../Icon';
import { Theme } from '../../../theme';

// ヘッダーコンポーネントのProps型定義
export interface HeaderProps {
  /**
   * ヘッダータイトル
   */
  title?: string;

  /**
   * サブタイトル
   */
  subtitle?: string;

  /**
   * 左側の要素（戻るボタンなど）
   */
  leftElement?: React.ReactNode;

  /**
   * 右側の要素（アクションボタンなど）
   */
  rightElement?: React.ReactNode;

  /**
   * 戻るボタンを表示するか
   * @default false
   */
  showBackButton?: boolean;

  /**
   * 戻るボタンのコールバック
   */
  onBackPress?: () => void;

  /**
   * ヘッダーのバリアント
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'transparent';

  /**
   * ヘッダーのスタイル
   */
  style?: StyleProp<ViewStyle>;

  /**
   * タイトルのスタイル
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * サブタイトルのスタイル
   */
  subtitleStyle?: StyleProp<TextStyle>;

  /**
   * StatusBarのスタイル
   * @default 'dark-content'
   */
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';

  /**
   * SafeAreaを使用するか
   * @default true
   */
  useSafeArea?: boolean;
}

/**
 * Header コンポーネント
 *
 * アプリケーション全体で使用されるヘッダーコンポーネント
 *
 * @example
 * ```tsx
 * <Header
 *   title="タスク一覧"
 *   showBackButton
 *   onBackPress={handleBack}
 *   rightElement={
 *     <TouchableOpacity onPress={handleAdd}>
 *       <Icon name="add" />
 *     </TouchableOpacity>
 *   }
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftElement,
  rightElement,
  showBackButton = false,
  onBackPress,
  variant = 'default',
  style,
  titleStyle,
  subtitleStyle,
  statusBarStyle = 'dark-content',
  useSafeArea = true,
}) => {
  const insets = useSafeAreaInsets();

  // ヘッダーの高さを計算
  const headerHeight = useSafeArea
    ? Platform.select({
        ios: 44 + insets.top,
        android: 56,
        default: 56,
      })
    : Platform.select({
        ios: 44,
        android: 56,
        default: 56,
      });

  // ヘッダーのスタイル
  const headerStyles = [
    styles.container,
    headerVariants[variant],
    { height: headerHeight, paddingTop: useSafeArea ? insets.top : 0 },
    style,
  ];

  // テキストカラーの取得
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return Theme.colors.textInverse;
      case 'transparent':
        return Theme.colors.textPrimary;
      default:
        return Theme.colors.textPrimary;
    }
  };

  const textColor = getTextColor();

  // 戻るボタンの要素
  const backButton = showBackButton && onBackPress && (
    <TouchableOpacity
      onPress={onBackPress}
      style={styles.backButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon name={IconNames.back} size="lg" color={textColor} />
    </TouchableOpacity>
  );

  return (
    <>
      {/* StatusBar */}
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={
          variant === 'primary' ? Theme.colors.primary : 'transparent'
        }
        translucent={useSafeArea}
      />

      {/* Header Container */}
      <View style={headerStyles}>
        <View style={styles.content}>
          {/* 左側要素 */}
          <View style={styles.left}>{leftElement || backButton}</View>

          {/* 中央要素（タイトル） */}
          <View style={styles.center}>
            {title && (
              <Text
                style={[styles.title, { color: textColor }, titleStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                style={[styles.subtitle, { color: textColor }, subtitleStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {subtitle}
              </Text>
            )}
          </View>

          {/* 右側要素 */}
          <View style={styles.right}>{rightElement}</View>
        </View>
      </View>
    </>
  );
};

// デフォルトエクスポート
export default Header;
