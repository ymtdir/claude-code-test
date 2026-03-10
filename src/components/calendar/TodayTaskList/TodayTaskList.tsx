import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from './TodayTaskList.styles';
import type { Task } from '../../../mocks/taskData';

interface TodayTaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskPostpone?: (taskId: string) => void;
}

/**
 * 今日のタスクリストコンポーネント
 * タスクの表示と完了/延期操作を管理
 */
export const TodayTaskList: React.FC<TodayTaskListProps> = ({
  tasks,
  onTaskComplete,
}) => {
  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => onTaskComplete(item.id)}
    >
      <View style={styles.taskCheckbox}>
        {item.completed && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            item.completed && styles.taskTitleCompleted,
          ]}
        >
          {item.title}
        </Text>
        {item.time && <Text style={styles.taskTime}>{item.time}</Text>}
      </View>
    </TouchableOpacity>
  );

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTaskText}>タスクがありません</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

/**
 * タスクアイテムコンポーネント
 * スワイプジェスチャー対応（将来実装）
 */
export const TaskItem: React.FC<{
  task: Task;
  onComplete: (taskId: string) => void;
  onPostpone?: (taskId: string) => void;
}> = ({ task, onComplete }) => {
  return (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => onComplete(task.id)}
    >
      <View style={styles.taskCheckbox}>
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            task.completed && styles.taskTitleCompleted,
          ]}
        >
          {task.title}
        </Text>
        {task.time && <Text style={styles.taskTime}>{task.time}</Text>}
        <View style={styles.taskMeta}>
          <Text
            style={[
              styles.priorityBadge,
              task.priority === 'high'
                ? styles.priorityHigh
                : task.priority === 'medium'
                  ? styles.priorityMedium
                  : styles.priorityLow,
            ]}
          >
            {task.priority === 'high'
              ? '高'
              : task.priority === 'medium'
                ? '中'
                : '低'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * タスク追加ボタンコンポーネント
 */
export const AddTaskButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.addTaskButton} onPress={onPress}>
      <Text style={styles.addTaskButtonText}>＋ タスクを追加</Text>
    </TouchableOpacity>
  );
};
