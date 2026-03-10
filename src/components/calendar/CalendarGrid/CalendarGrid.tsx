import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';
import { styles } from './CalendarGrid.styles';
import { getRokuyouForMonth } from '../../../utils/calendar/rokuyou';
import { getHolidayMap, getDateColor } from '../../../utils/calendar/holidays';
import { getTaskCountByDate } from '../../../mocks/taskData';

interface CalendarGridProps {
  selectedDate: string;
  currentMonth: Date;
  onDateSelect: (date: string) => void;
  onMonthChange: (month: DateData) => void;
}

/**
 * カレンダーグリッドコンポーネント
 * react-native-calendarsをラップし、六曜・祝日・タスク数を表示
 */
export const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  currentMonth,
  onDateSelect,
  onMonthChange,
}) => {
  // 現在月の六曜データ
  const rokuyouMap = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return getRokuyouForMonth(year, month);
  }, [currentMonth]);

  // 現在月の祝日データ
  const holidayMap = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return getHolidayMap(year, month);
  }, [currentMonth]);

  // タスク数データ
  const taskCountMap = useMemo(() => getTaskCountByDate(), []);

  // カレンダーのマーカー設定
  const markedDates = useMemo(() => {
    // react-native-calendarsのMarkedDates型が複雑なため、Record型で定義
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const marks: Record<string, any> = {};

    // 選択中の日付をマーク
    marks[selectedDate] = {
      selected: true,
      selectedColor: '#4A90E2',
    };

    // タスク数をドットで表示
    Object.entries(taskCountMap).forEach(([date, count]) => {
      if (!marks[date]) {
        marks[date] = {};
      }
      // タスク数に応じてドットの数を設定（最大3つ）
      const dotCount = Math.min(count, 3);
      marks[date].dots = Array.from({ length: dotCount }, (_, i) => ({
        key: `dot-${i}`,
        color: '#4ECDC4',
      }));
    });

    return marks;
  }, [selectedDate, taskCountMap]);

  // カスタムDay Component（六曜と祝日を表示）
  const renderDay = (date: DateData) => {
    const dateStr = date.dateString;
    const rokuyou = rokuyouMap[dateStr] || '';
    const holiday = holidayMap[dateStr] || '';
    const taskCount = taskCountMap[dateStr] || 0;
    const dateObj = new Date(dateStr);
    const textColor = getDateColor(dateObj);

    return (
      <View style={styles.dayContainer}>
        <Text style={[styles.dayNumber, { color: textColor }]}>{date.day}</Text>
        {rokuyou && <Text style={styles.rokuyouText}>{rokuyou}</Text>}
        {holiday && <Text style={styles.holidayText}>{holiday}</Text>}
        {taskCount > 0 && (
          <View style={styles.taskBadge}>
            <Text style={styles.taskBadgeText}>{taskCount}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={currentMonth.toISOString().split('T')[0]}
        onDayPress={(day: DateData) => onDateSelect(day.dateString)}
        onMonthChange={onMonthChange}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={{
          backgroundColor: '#FFFFFF',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#2C3E50',
          selectedDayBackgroundColor: '#4A90E2',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#4A90E2',
          dayTextColor: '#2C3E50',
          textDisabledColor: '#95A5A6',
          dotColor: '#4ECDC4',
          selectedDotColor: '#FFFFFF',
          arrowColor: '#4A90E2',
          monthTextColor: '#2C3E50',
          indicatorColor: '#4A90E2',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        dayComponent={({ date }: { date?: DateData; state?: string }) => {
          if (!date) return null;
          return renderDay(date);
        }}
      />
    </View>
  );
};
