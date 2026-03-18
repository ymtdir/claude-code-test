/**
 * TaskFormコンポーネント
 * タスクの新規作成・編集用フォーム
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import type { Task, TaskInput, Category, Priority } from '../../types/task';
import { CategoryPicker } from './CategoryPicker';
import { PrioritySelector } from './PrioritySelector';
import { ReminderSettingsAdapter } from './ReminderSettingsAdapter';
import { DateTimePickerComponent } from './DateTimePicker';
import { validateTask } from '../../utils/validation';
import { DEFAULT_CATEGORY } from '../../constants/categories';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskInput) => void;
  onCancel?: () => void;
  submitButtonText?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  submitButtonText = '保存',
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    defaultValues: {
      title: task?.title || '',
      category: task?.category || DEFAULT_CATEGORY,
      date: task?.date || new Date(),
      time: task?.time,
      priority: task?.priority || 'medium',
      note: task?.note || '',
      reminders: task?.reminders || [],
    },
  });

  // フォーム送信処理
  const onFormSubmit = (data: TaskInput) => {
    const validationResult = validateTask(data);

    if (!validationResult.isValid) {
      Alert.alert(
        'バリデーションエラー',
        validationResult.errors.map((e) => e.message).join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* タイトル入力 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>タイトル*</Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: 'タイトルは必須です' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textInput, errors.title && styles.errorInput]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="タスクのタイトルを入力"
                maxLength={100}
              />
            )}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title.message}</Text>
          )}
        </View>

        {/* カテゴリー選択 */}
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <CategoryPicker
              selected={value as Category}
              onSelect={onChange}
              disabled={isSubmitting}
            />
          )}
        />

        {/* 日付と時刻 */}
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <Controller
              control={control}
              name="time"
              render={({
                field: { onChange: onTimeChange, value: timeValue },
              }) => (
                <DateTimePickerComponent
                  date={value || new Date()}
                  time={timeValue}
                  onChange={(date, time) => {
                    onChange(date);
                    onTimeChange(time);
                  }}
                  disabled={isSubmitting}
                />
              )}
            />
          )}
        />

        {/* 優先度選択 */}
        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <PrioritySelector
              priority={value as Priority}
              onChange={onChange}
              disabled={isSubmitting}
            />
          )}
        />

        {/* リマインダー設定 */}
        <Controller
          control={control}
          name="reminders"
          render={({ field: { onChange, value } }) => (
            <Controller
              control={control}
              name="title"
              render={({ field: { value: titleValue } }) => (
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { value: dateValue } }) => (
                    <Controller
                      control={control}
                      name="time"
                      render={({ field: { value: timeValue } }) => (
                        <ReminderSettingsAdapter
                          taskId={task?.id}
                          taskTitle={titleValue || task?.title || '新規タスク'}
                          taskDate={dateValue}
                          taskTime={timeValue}
                          reminders={value || []}
                          onChange={onChange}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  )}
                />
              )}
            />
          )}
        />

        {/* メモ入力 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>メモ</Text>
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textArea]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="メモを入力（任意）"
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />
            )}
          />
        </View>

        {/* ボタン */}
        <View style={styles.buttonContainer}>
          {onCancel && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              isSubmitting && styles.disabledButton,
            ]}
            onPress={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '処理中...' : submitButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
    minHeight: 100,
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
});
