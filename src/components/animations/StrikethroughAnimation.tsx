/**
 * StrikethroughAnimation Component
 * Animated strikethrough effect using React Native Reanimated
 */

import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface StrikethroughAnimationProps extends PropsWithChildren {
  isCompleted: boolean;
  text?: string;
  color?: string;
  textColor?: string;
  strikethroughColor?: string;
  delay?: number;
  duration?: number;
}

/**
 * Strikethrough animation component
 */
export const StrikethroughAnimation: React.FC<StrikethroughAnimationProps> = ({
  isCompleted,
  text,
  children,
  textColor = '#333',
  strikethroughColor = '#95A5A6',
  delay = 400,
  duration = 200,
}) => {
  const width = useSharedValue(0);
  const textOpacity = useSharedValue(1);

  const animatedLineStyle = useAnimatedStyle(() => ({
    width: `${interpolate(width.value, [0, 1], [0, 100], Extrapolate.CLAMP)}%`,
    height: 2,
    backgroundColor: strikethroughColor,
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: [{ translateY: -1 }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      textOpacity.value,
      [0, 1],
      [0.5, 1],
      Extrapolate.CLAMP
    ),
  }));

  useEffect(() => {
    if (isCompleted) {
      width.value = withDelay(delay, withTiming(1, { duration }));
      textOpacity.value = withDelay(delay, withTiming(0.5, { duration }));
    } else {
      width.value = withTiming(0, { duration });
      textOpacity.value = withTiming(1, { duration });
    }
  }, [isCompleted, delay, duration, width, textOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={animatedTextStyle}>
        {text ? (
          <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        ) : (
          children
        )}
      </Animated.View>
      <Animated.View style={animatedLineStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default StrikethroughAnimation;
