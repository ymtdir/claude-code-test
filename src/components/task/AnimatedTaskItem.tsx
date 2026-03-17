/**
 * AnimatedTaskItem Component
 * Integrated animated task item with all animation effects
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import CheckmarkAnimation from '../animations/CheckmarkAnimation';
import RippleEffect from '../animations/RippleEffect';
import StampAnimation from '../animations/StampAnimation';
import StrikethroughAnimation from '../animations/StrikethroughAnimation';
import SwipeableTask from '../animations/SwipeableTask';
import { hapticFeedback } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface AnimatedTaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onPostpone: (taskId: string) => void;
  onToggle?: (taskId: string) => void;
  showAnimations?: boolean;
  enableSwipe?: boolean;
}

/**
 * Animated task item component with all effects integrated
 */
export const AnimatedTaskItem: React.FC<AnimatedTaskItemProps> = ({
  task,
  onComplete,
  onPostpone,
  onToggle,
  showAnimations = true,
  enableSwipe = true,
}) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [showRipple, setShowRipple] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  const handleComplete = useCallback(() => {
    if (!isCompleted) {
      setIsCompleted(true);
      setShowRipple(true);
      setShowStamp(true);
      hapticFeedback.taskComplete();

      // Hide ripple after animation
      setTimeout(() => setShowRipple(false), 600);

      // Call parent callback after animations
      setTimeout(() => {
        onComplete(task.id);
      }, 800);
    }
  }, [isCompleted, task.id, onComplete]);

  const handlePostpone = useCallback(() => {
    hapticFeedback.taskSwipe();
    onPostpone(task.id);
  }, [task.id, onPostpone]);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      const { locationX, locationY } = event.nativeEvent;
      setRipplePosition({ x: locationX || 0, y: locationY || 0 });

      if (onToggle) {
        onToggle(task.id);
      } else {
        if (isCompleted) {
          setIsCompleted(false);
          setShowStamp(false);
          hapticFeedback.taskSelect();
        } else {
          handleComplete();
        }
      }
    },
    [isCompleted, task.id, onToggle, handleComplete]
  );

  const handleSwipeStart = useCallback(() => {
    hapticFeedback.dragStart();
  }, []);

  const handleSwipeEnd = useCallback(() => {
    hapticFeedback.dragEnd();
  }, []);

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFD93D';
      case 'low':
        return '#6BCB77';
      default:
        return '#95A5A6';
    }
  };

  const taskContent = (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.taskContent}
    >
      <View style={styles.taskRow}>
        <View style={styles.checkboxContainer}>
          {showAnimations ? (
            <CheckmarkAnimation
              isCompleted={isCompleted}
              size={24}
              color="#4ECDC4"
            />
          ) : (
            <View
              style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
            />
          )}
        </View>

        <View style={styles.taskInfo}>
          {showAnimations && isCompleted ? (
            <StrikethroughAnimation
              isCompleted={isCompleted}
              text={task.title}
              textColor={isCompleted ? '#95A5A6' : '#333'}
            />
          ) : (
            <Text
              style={[
                styles.taskTitle,
                isCompleted && styles.taskTitleCompleted,
              ]}
            >
              {task.title}
            </Text>
          )}

          {task.description && (
            <Text
              style={[
                styles.taskDescription,
                isCompleted && styles.taskDescriptionCompleted,
              ]}
            >
              {task.description}
            </Text>
          )}

          {task.dueDate && (
            <Text style={styles.dueDate}>
              Due: {task.dueDate.toLocaleDateString()}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getPriorityColor() },
          ]}
        />
      </View>

      {showAnimations && (
        <>
          <RippleEffect
            trigger={showRipple}
            x={ripplePosition.x}
            y={ripplePosition.y}
            color="#4ECDC4"
            size={SCREEN_WIDTH}
          />
          {isCompleted && (
            <View style={styles.stampContainer}>
              <StampAnimation
                show={showStamp}
                text="DONE"
                color="#4ECDC4"
                fontSize={18}
              />
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );

  if (enableSwipe) {
    return (
      <SwipeableTask
        onComplete={handleComplete}
        onPostpone={handlePostpone}
        onSwipeStart={handleSwipeStart}
        onSwipeEnd={handleSwipeEnd}
      >
        {taskContent}
      </SwipeableTask>
    );
  }

  return taskContent;
};

const styles = StyleSheet.create({
  taskContent: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#95A5A6',
    backgroundColor: 'white',
  },
  checkboxCompleted: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  taskInfo: {
    flex: 1,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  taskTitleCompleted: {
    color: '#95A5A6',
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  taskDescriptionCompleted: {
    color: '#95A5A6',
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  stampContainer: {
    position: 'absolute',
    right: 50,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
});

export default AnimatedTaskItem;
