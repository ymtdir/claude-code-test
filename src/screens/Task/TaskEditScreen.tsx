/**
 * TaskEditScreen
 * タスク編集画面
 */

import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskForm } from '../../components/task/TaskForm';
import { DeleteButton } from '../../components/common/DeleteButton';
import type { Task, TaskInput } from '../../types/task';
import { TaskManager } from '../../utils/taskManager';

export function TaskEditScreen() {
  const navigate = useNavigate();
  const params = useParams<{ taskId: string }>();
  const taskId = params.taskId || '';

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // タスクデータの取得
  useEffect(() => {
    const loadTask = async () => {
      try {
        const taskData = await TaskManager.getTaskById(taskId);
        if (taskData) {
          setTask(taskData);
        } else {
          Alert.alert('エラー', 'タスクが見つかりませんでした', [
            {
              text: 'OK',
              onPress: () => navigate(-1),
            },
          ]);
        }
      } catch (error) {
        console.error('タスク読み込みエラー:', error);
        Alert.alert('エラー', 'タスクの読み込みに失敗しました', [
          {
            text: 'OK',
            onPress: () => navigate(-1),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId, navigate]);

  // タスク更新処理
  const handleUpdateTask = async (taskData: TaskInput) => {
    try {
      // タスクを更新
      const updatedTask = await TaskManager.updateTask(taskId, taskData);

      if (updatedTask) {
        // 成功メッセージを表示
        Alert.alert('成功', 'タスクが更新されました', [
          {
            text: 'OK',
            onPress: () => {
              // 前の画面に戻る
              navigate(-1);
            },
          },
        ]);
      } else {
        throw new Error('タスクの更新に失敗しました');
      }
    } catch (error) {
      // エラーメッセージを表示
      Alert.alert('エラー', 'タスクの更新に失敗しました', [{ text: 'OK' }]);
      console.error('タスク更新エラー:', error);
    }
  };

  // タスク削除処理
  const handleDeleteTask = async () => {
    try {
      // タスクを削除
      const deleted = await TaskManager.deleteTask(taskId);

      if (deleted) {
        // 成功メッセージを表示
        Alert.alert('成功', 'タスクが削除されました', [
          {
            text: 'OK',
            onPress: () => {
              // 前の画面に戻る
              navigate(-1);
            },
          },
        ]);
      } else {
        throw new Error('タスクの削除に失敗しました');
      }
    } catch (error) {
      // エラーメッセージを表示
      Alert.alert('エラー', 'タスクの削除に失敗しました', [{ text: 'OK' }]);
      console.error('タスク削除エラー:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // ローディング表示
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  // タスクが見つからない場合
  if (!task) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TaskForm
        task={task}
        onSubmit={handleUpdateTask}
        onCancel={handleCancel}
        submitButtonText="変更を保存"
      />
      <View style={styles.deleteButtonContainer}>
        <DeleteButton
          onPress={handleDeleteTask}
          title="タスクを削除"
          confirmMessage="このタスクを削除してもよろしいですか？この操作は取り消せません。"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  deleteButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
