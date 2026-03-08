import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styles } from './TaskCard.styles';
import { Icon, IconNames } from '../../common/Icon';
import { Theme } from '../../../theme';

// タスクの優先度
export type TaskPriority = 'high' | 'medium' | 'low' | 'none';

// タスクの状態
export type TaskStatus = 'pending' | 'completed' | 'cancelled';

// TaskCardコンポーネントのProps型定義
export interface TaskCardProps {
  /**
   * タスクのタイトル
   */
  title: string;

  /**
   * タスクの説明
   */
  description?: string;

  /**
   * タスクの優先度
   * @default 'none'
   */
  priority?: TaskPriority;

  /**
   * タスクの状態
   * @default 'pending'
   */
  status?: TaskStatus;

  /**
   * 期限日時
   */
  dueDate?: Date | string;

  /**
   * カテゴリー
   */
  category?: string;

  /**
   * カテゴリーの色
   */
  categoryColor?: string;

  /**
   * タスク完了時のコールバック
   */
  onComplete?: () => void;

  /**
   * タスク削除時のコールバック
   */
  onDelete?: () => void;

  /**
   * タスクタップ時のコールバック
   */
  onPress?: () => void;

  /**
   * スワイプ可能かどうか
   * @default true
   */
  swipeable?: boolean;

  /**
   * カードのスタイル
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * TaskCard コンポーネント
 *
 * タスク情報を表示するカードコンポーネント
 * スワイプジェスチャーによる完了・削除アクションに対応
 *
 * @example
 * ```tsx
 * <TaskCard
 *   title="会議の準備"
 *   description="資料作成と会議室予約"
 *   priority="high"
 *   dueDate={new Date()}
 *   onComplete={handleComplete}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  priority = 'none',
  status = 'pending',
  dueDate,
  category,
  categoryColor,
  onComplete,
  onDelete,
  onPress,
  swipeable = true,
  style,
}) => {
  // アニメーション値
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // タスク完了時のアニメーション
  const handleComplete = () => {
    scale.value = withTiming(0.95, { duration: 200 });
    opacity.value = withTiming(0.5, { duration: 200 });
    setTimeout(() => {
      onComplete?.();
      // アニメーションをリセット
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }, 200);
  };

  // アニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // 優先度の色を取得
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return Theme.colors.priorityHigh;
      case 'medium':
        return Theme.colors.priorityMedium;
      case 'low':
        return Theme.colors.priorityLow;
      default:
        return Theme.colors.priorityNone;
    }
  };

  // 期限日時のフォーマット
  const formatDueDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const isOverdue = d < now && status === 'pending';
    const isToday = d.toDateString() === now.toDateString();

    let dateText = '';
    if (isToday) {
      dateText = `今日 ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    } else {
      dateText = `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    }

    return { text: dateText, isOverdue };
  };

  // 左スワイプアクション（完了）
  const renderLeftActions = () => {
    if (status === 'completed') return null;

    return (
      <TouchableOpacity style={styles.swipeActionLeft} onPress={handleComplete}>
        <Icon
          name={IconNames.check}
          size="lg"
          color={Theme.colors.textInverse}
        />
        <Text style={styles.swipeActionText}>完了</Text>
      </TouchableOpacity>
    );
  };

  // 右スワイプアクション（削除）
  const renderRightActions = () => (
    <TouchableOpacity style={styles.swipeActionRight} onPress={onDelete}>
      <Icon
        name={IconNames.delete}
        size="lg"
        color={Theme.colors.textInverse}
      />
      <Text style={styles.swipeActionText}>削除</Text>
    </TouchableOpacity>
  );

  // カード内容
  const cardContent = (
    <Animated.View
      style={[
        styles.container,
        status === 'completed' && styles.completedContainer,
        style,
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.content}>
          {/* 優先度インジケーター */}
          {priority !== 'none' && (
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor() },
              ]}
            />
          )}

          {/* メインコンテンツ */}
          <View style={styles.mainContent}>
            {/* カテゴリー */}
            {category && (
              <View style={styles.categoryContainer}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: categoryColor || Theme.colors.primary },
                  ]}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              </View>
            )}

            {/* タイトル */}
            <Text
              style={[
                styles.title,
                status === 'completed' && styles.completedTitle,
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>

            {/* 説明 */}
            {description && (
              <Text
                style={[
                  styles.description,
                  status === 'completed' && styles.completedDescription,
                ]}
                numberOfLines={2}
              >
                {description}
              </Text>
            )}

            {/* 期限 */}
            {dueDate && (
              <View style={styles.dueDateContainer}>
                <Icon
                  name={IconNames.time}
                  size="xs"
                  color={
                    formatDueDate(dueDate).isOverdue
                      ? Theme.colors.error
                      : Theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.dueDate,
                    formatDueDate(dueDate).isOverdue && styles.overdue,
                  ]}
                >
                  {formatDueDate(dueDate).text}
                </Text>
              </View>
            )}
          </View>

          {/* チェックマーク（完了時） */}
          {status === 'completed' && (
            <View style={styles.checkIcon}>
              <Icon
                name={IconNames.checkCircle}
                size="lg"
                color={Theme.colors.success}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  // スワイプ可能な場合
  if (swipeable && (onComplete || onDelete)) {
    return (
      <GestureHandlerRootView>
        <Swipeable
          renderLeftActions={onComplete ? renderLeftActions : undefined}
          renderRightActions={onDelete ? renderRightActions : undefined}
          friction={2}
          overshootFriction={8}
        >
          {cardContent}
        </Swipeable>
      </GestureHandlerRootView>
    );
  }

  // スワイプ不可の場合
  return cardContent;
};

// デフォルトエクスポート
export default TaskCard;
