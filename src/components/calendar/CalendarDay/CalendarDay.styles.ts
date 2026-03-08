import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../../theme';

// 状態別スタイル
export const dayStates: Record<string, ViewStyle> = {
  default: {
    backgroundColor: 'transparent',
  },
  today: {
    backgroundColor: Theme.colors.calendarToday,
  },
  selected: {
    backgroundColor: Theme.colors.calendarSelected,
  },
  disabled: {
    opacity: 0.3,
  },
};

// テキスト状態別スタイル
export const dayTextStates: Record<string, TextStyle> = {
  default: {
    color: Theme.colors.textPrimary,
  },
  today: {
    color: Theme.colors.textInverse,
    fontWeight: Theme.fontWeight.bold,
  },
  selected: {
    color: Theme.colors.textInverse,
    fontWeight: Theme.fontWeight.bold,
  },
  disabled: {
    color: Theme.colors.textDisabled,
  },
};

// 基本スタイル
export const styles = StyleSheet.create({
  // コンテナスタイル
  container: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Theme.spacing.xxs,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: 'transparent',
  },

  // 曜日タイプ別スタイル
  weekend: {
    backgroundColor: 'transparent',
  },

  holiday: {
    backgroundColor: 'transparent',
  },

  // 他の月の日付
  otherMonth: {
    opacity: 0.4,
  },

  // 期間選択スタイル
  periodStart: {
    borderTopLeftRadius: Theme.borderRadius.full,
    borderBottomLeftRadius: Theme.borderRadius.full,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  periodEnd: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: Theme.borderRadius.full,
    borderBottomRightRadius: Theme.borderRadius.full,
  },

  periodMiddle: {
    borderRadius: 0,
    backgroundColor: Theme.colors.primaryLight,
  },

  // 日付テキストスタイル
  dayText: {
    ...Theme.typography.body,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
  },

  // 週末のテキスト
  weekendText: {
    color: Theme.colors.calendarWeekend,
  },

  // 祝日のテキスト
  holidayText: {
    color: Theme.colors.calendarHoliday,
  },

  // 他の月のテキスト
  otherMonthText: {
    color: Theme.colors.textDisabled,
  },

  // ドットコンテナ
  dotsContainer: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ドット
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },

  // タスク数コンテナ
  taskCountContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Theme.colors.error,
    borderRadius: Theme.borderRadius.full,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // タスク数テキスト
  taskCountText: {
    ...Theme.typography.overline,
    color: Theme.colors.textInverse,
    fontSize: 10,
    lineHeight: 16,
    fontWeight: Theme.fontWeight.bold,
  },
});

// スタイルを統合したオブジェクトをエクスポート（互換性のため）
export const allStyles = {
  ...styles,
  states: dayStates,
  textStates: dayTextStates,
};
