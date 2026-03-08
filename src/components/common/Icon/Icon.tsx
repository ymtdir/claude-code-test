import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { TextStyle } from 'react-native';
import { Theme } from '../../../theme';

// アイコンサイズの型定義
export type IconSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// よく使うアイコン名の定数
export const IconNames = {
  // ナビゲーション
  back: 'arrow-back',
  forward: 'arrow-forward',
  up: 'keyboard-arrow-up',
  down: 'keyboard-arrow-down',
  left: 'keyboard-arrow-left',
  right: 'keyboard-arrow-right',
  menu: 'menu',
  close: 'close',

  // アクション
  add: 'add',
  remove: 'remove',
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  share: 'share',
  search: 'search',
  filter: 'filter-list',
  refresh: 'refresh',

  // ステータス
  check: 'check',
  checkCircle: 'check-circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
  help: 'help',

  // カレンダー・時間
  calendar: 'calendar-today',
  time: 'access-time',
  alarm: 'alarm',
  schedule: 'schedule',
  event: 'event',

  // タスク
  task: 'assignment',
  taskAlt: 'assignment-turned-in',
  taskLate: 'assignment-late',
  list: 'list',
  checklist: 'checklist',

  // ユーザー
  person: 'person',
  people: 'people',
  account: 'account-circle',
  settings: 'settings',
  logout: 'logout',

  // その他
  home: 'home',
  star: 'star',
  starOutline: 'star-outline',
  favorite: 'favorite',
  favoriteOutline: 'favorite-outline',
  notification: 'notifications',
  notificationNone: 'notifications-none',
  visibility: 'visibility',
  visibilityOff: 'visibility-off',
  attachment: 'attachment',
  location: 'location-on',
  more: 'more-vert',
  moreHoriz: 'more-horiz',
} as const;

export type IconName = keyof typeof IconNames | string;

// アイコンコンポーネントのProps型定義
export interface IconProps {
  /**
   * アイコン名（Material Iconsの名前）
   */
  name: IconName;

  /**
   * アイコンのサイズ
   * @default 'md'
   */
  size?: IconSizeName | number;

  /**
   * アイコンの色
   * @default Theme.colors.textPrimary
   */
  color?: string;

  /**
   * スタイル
   */
  style?: TextStyle | TextStyle[];
}

/**
 * Icon コンポーネント
 *
 * Material Iconsを使用したアイコンコンポーネント
 *
 * @example
 * ```tsx
 * <Icon name="check" size="lg" color={Theme.colors.success} />
 * <Icon name={IconNames.calendar} size="md" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = Theme.colors.textPrimary,
  style,
}) => {
  // サイズを数値に変換
  const getIconSize = (): number => {
    if (typeof size === 'number') {
      return size;
    }
    return Theme.iconSize[size];
  };

  // アイコン名を取得（定数から変換）
  const getIconName = (): string => {
    if (name in IconNames) {
      return IconNames[name as keyof typeof IconNames];
    }
    return name;
  };

  return (
    <MaterialIcons
      name={getIconName()}
      size={getIconSize()}
      color={color}
      style={style}
    />
  );
};

// デフォルトエクスポート
export default Icon;
