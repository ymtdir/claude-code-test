import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { styles } from './ProgressBar.styles';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  showPercent?: boolean;
  animated?: boolean;
}

/**
 * プログレスバーコンポーネント
 * タスク完了率を視覚的に表示
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  label,
  showPercent = true,
  animated = true,
}) => {
  // Animated.Valueはレンダー中にアクセス可能な特殊なオブジェクト
  // eslint-disable-next-line react-hooks/refs
  const animatedValue = useRef(new Animated.Value(0)).current;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(percentage);
    }
  }, [percentage, animated, animatedValue]);

  // eslint-disable-next-line react-hooks/refs
  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // プログレスバーの色を完了率に応じて変更
  const getProgressColor = () => {
    if (percentage >= 80) return '#4ECDC4'; // 高達成率: ミントグリーン
    if (percentage >= 50) return '#FFD93D'; // 中達成率: イエロー
    if (percentage >= 30) return '#FF8787'; // 低達成率: ライトレッド
    return '#95A5A6'; // 最低達成率: グレー
  };

  return (
    <View style={styles.container}>
      {/* ラベル表示 */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>
            {label || `タスク (${completed}/${total}完了)`}
          </Text>
          {showPercent && (
            <Text style={[styles.percentText, { color: getProgressColor() }]}>
              {percentage}%
            </Text>
          )}
        </View>
      )}

      {/* プログレスバー本体 */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: widthInterpolated,
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>

      {/* 達成度メッセージ */}
      {percentage === 100 && (
        <Text style={styles.completionMessage}>🎉 すべて完了！</Text>
      )}
      {percentage === 0 && total > 0 && (
        <Text style={styles.startMessage}>最初のタスクを始めましょう</Text>
      )}
    </View>
  );
};

/**
 * ミニプログレスバーコンポーネント
 * 小さいスペース用のシンプルなプログレスバー
 */
export const MiniProgressBar: React.FC<{
  percentage: number;
  color?: string;
}> = ({ percentage, color = '#4ECDC4' }) => {
  return (
    <View style={styles.miniProgressBar}>
      <View
        style={[
          styles.miniProgressFill,
          {
            width: `${percentage}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};
