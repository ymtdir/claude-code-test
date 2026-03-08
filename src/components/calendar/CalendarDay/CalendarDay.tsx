import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { styles, dayStates, dayTextStates } from './CalendarDay.styles';

// 日付の状態
export type DayState = 'default' | 'today' | 'selected' | 'disabled';

// 日付のタイプ
export type DayType = 'weekday' | 'weekend' | 'holiday';

// CalendarDayコンポーネントのProps型定義
export interface CalendarDayProps {
  /**
   * 日付（1-31）
   */
  day: number;

  /**
   * 月（現在表示中の月と異なる場合は前月/翌月）
   */
  month?: number;

  /**
   * 年
   */
  year?: number;

  /**
   * 日付の状態
   * @default 'default'
   */
  state?: DayState;

  /**
   * 日付のタイプ
   * @default 'weekday'
   */
  type?: DayType;

  /**
   * 選択されているかどうか
   * @default false
   */
  isSelected?: boolean;

  /**
   * 今日かどうか
   * @default false
   */
  isToday?: boolean;

  /**
   * 無効状態（選択不可）
   * @default false
   */
  isDisabled?: boolean;

  /**
   * 現在の月かどうか
   * @default true
   */
  isCurrentMonth?: boolean;

  /**
   * マーキング（タスクやイベントの表示）
   */
  marking?: {
    /**
     * ドットを表示するか
     */
    dots?: Array<{
      color: string;
      key?: string;
    }>;

    /**
     * 期間選択の開始日
     */
    startingDay?: boolean;

    /**
     * 期間選択の終了日
     */
    endingDay?: boolean;

    /**
     * 期間選択の中間日
     */
    period?: boolean;

    /**
     * タスク数
     */
    taskCount?: number;
  };

  /**
   * 日付がタップされた時のコールバック
   */
  onPress?: (date: { day: number; month?: number; year?: number }) => void;

  /**
   * 長押し時のコールバック
   */
  onLongPress?: (date: { day: number; month?: number; year?: number }) => void;

  /**
   * コンテナのスタイル
   */
  style?: StyleProp<ViewStyle>;

  /**
   * テキストのスタイル
   */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * CalendarDay コンポーネント
 *
 * カレンダーの日付セルを表示するコンポーネント
 *
 * @example
 * ```tsx
 * <CalendarDay
 *   day={15}
 *   isToday={true}
 *   marking={{
 *     dots: [{ color: '#FF6B6B' }],
 *     taskCount: 3
 *   }}
 *   onPress={(date) => console.log('Selected:', date)}
 * />
 * ```
 */
export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  month,
  year,
  state = 'default',
  type = 'weekday',
  isSelected = false,
  isToday = false,
  isDisabled = false,
  isCurrentMonth = true,
  marking,
  onPress,
  onLongPress,
  style,
  textStyle,
}) => {
  // 日付の状態を決定
  const getDayState = (): DayState => {
    if (isDisabled) return 'disabled';
    if (isSelected) return 'selected';
    if (isToday) return 'today';
    return state;
  };

  const currentState = getDayState();

  // コンテナのスタイル
  const containerStyles = [
    styles.container,
    dayStates[currentState],
    type === 'weekend' && styles.weekend,
    type === 'holiday' && styles.holiday,
    !isCurrentMonth && styles.otherMonth,
    marking?.startingDay && styles.periodStart,
    marking?.endingDay && styles.periodEnd,
    marking?.period && styles.periodMiddle,
    style,
  ];

  // テキストのスタイル
  const dayTextStyles = [
    styles.dayText,
    dayTextStates[currentState],
    type === 'weekend' && styles.weekendText,
    type === 'holiday' && styles.holidayText,
    !isCurrentMonth && styles.otherMonthText,
    textStyle,
  ];

  // タップハンドラー
  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress({ day, month, year });
    }
  };

  // 長押しハンドラー
  const handleLongPress = () => {
    if (!isDisabled && onLongPress) {
      onLongPress({ day, month, year });
    }
  };

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={isDisabled}
      activeOpacity={0.6}
    >
      {/* 日付テキスト */}
      <Text style={dayTextStyles}>{day}</Text>

      {/* ドットマーキング */}
      {marking?.dots && marking.dots.length > 0 && (
        <View style={styles.dotsContainer}>
          {marking.dots.slice(0, 3).map((dot, index) => (
            <View
              key={dot.key || index}
              style={[styles.dot, { backgroundColor: dot.color }]}
            />
          ))}
        </View>
      )}

      {/* タスク数表示 */}
      {marking?.taskCount && marking.taskCount > 0 && (
        <View style={styles.taskCountContainer}>
          <Text style={styles.taskCountText}>
            {marking.taskCount > 9 ? '9+' : marking.taskCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// デフォルトエクスポート
export default CalendarDay;
