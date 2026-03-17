/**
 * StampAnimation Component
 * Animated stamp effect using React Native Reanimated
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface StampAnimationProps {
  show: boolean;
  text?: string;
  color?: string;
  fontSize?: number;
  duration?: number;
}

/**
 * Stamp animation component with bounce and rotation
 */
export const StampAnimation: React.FC<StampAnimationProps> = ({
  show,
  text = 'DONE',
  color = '#4ECDC4',
  fontSize = 24,
  duration = 300,
}) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (show) {
      opacity.value = withTiming(1, { duration: 100 });

      scale.value = withSequence(
        withSpring(1.3, {
          damping: 8,
          stiffness: 100,
          mass: 0.8,
        }),
        withSpring(1, {
          damping: 15,
          stiffness: 150,
          mass: 1,
        })
      );

      rotation.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withSpring(0, {
          damping: 15,
          stiffness: 150,
        })
      );
    } else {
      opacity.value = withTiming(0, { duration: 100 });
      scale.value = withTiming(0, { duration: 100 });
      rotation.value = withTiming(0, { duration: 100 });
    }
  }, [show, duration, scale, rotation, opacity]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={[styles.text, { color, fontSize }]}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default StampAnimation;
