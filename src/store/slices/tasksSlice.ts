/**
 * タスク管理用のRedux Slice
 */

import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { TaskRepository } from '../../repositories/TaskRepository';
import type { RootState } from '..';
import type { Priority } from '../../types/task';
import type { TaskFilter } from '../../types/store';
import type { TaskSchema } from '../../database/schema';

// タスクの状態型（TaskSchemaを使用）
interface TasksState {
  entities: Record<string, TaskSchema>;
  ids: string[];
  selectedId: string | null;
  filter: TaskFilter;
  loading: boolean;
  error: string | null;
}

// 初期状態
const initialState: TasksState = {
  entities: {},
  ids: [],
  selectedId: null,
  filter: {},
  loading: false,
  error: null,
};

// 非同期アクション: タスクの取得
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (date?: Date) => {
    const tasks = date
      ? await TaskRepository.findByDate(date)
      : await TaskRepository.findAll();

    // TaskModelをプレーンオブジェクトに変換
    return tasks.map((task) => task.toPlainObject());
  }
);

// 非同期アクション: タスクの作成
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<TaskSchema>) => {
    const task = await TaskRepository.create(taskData);
    return task.toPlainObject();
  }
);

// 非同期アクション: タスクの更新
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<TaskSchema> }) => {
    const task = await TaskRepository.update(id, updates);
    if (!task) {
      throw new Error('Task not found');
    }
    return task.toPlainObject();
  }
);

// 非同期アクション: タスクの削除
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    const result = await TaskRepository.delete(id);
    if (!result) {
      throw new Error('Failed to delete task');
    }
    return id;
  }
);

// Sliceの定義
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // タスクの選択
    selectTask: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },

    // フィルターの設定
    setFilter: (state, action: PayloadAction<TaskFilter>) => {
      state.filter = action.payload;
    },

    // タスクの完了
    completeTask: (state, action: PayloadAction<string>) => {
      const task = state.entities[action.payload];
      if (task) {
        task.status = 'completed';
        task.completedAt = new Date();
      }
    },

    // タスクの優先度変更
    updateTaskPriority: (
      state,
      action: PayloadAction<{ id: string; priority: Priority }>
    ) => {
      const task = state.entities[action.payload.id];
      if (task) {
        task.priority = action.payload.priority;
      }
    },

    // エラーのクリア
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        const tasks = action.payload;
        state.ids = tasks
          .map((t) => t.id)
          .filter((id): id is string => id !== undefined);
        state.entities = tasks.reduce(
          (acc, task) => {
            if (task.id) {
              acc[task.id] = task;
            }
            return acc;
          },
          {} as Record<string, TaskSchema>
        );
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })

      // createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        const task = action.payload;
        if (task.id) {
          state.entities[task.id] = task;
          state.ids.push(task.id);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      })

      // updateTask
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const task = action.payload;
        if (task.id) {
          state.entities[task.id] = task;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })

      // deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        delete state.entities[id];
        state.ids = state.ids.filter((taskId) => taskId !== id);
        if (state.selectedId === id) {
          state.selectedId = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

// アクションのエクスポート
export const {
  selectTask,
  setFilter,
  completeTask,
  updateTaskPriority,
  clearError,
} = tasksSlice.actions;

// セレクタ
export const selectAllTasks = (state: RootState) =>
  state.tasks.ids.map((id) => state.tasks.entities[id]);
export const selectTaskById = (id: string) => (state: RootState) =>
  state.tasks.entities[id];

// リデューサーのエクスポート
export default tasksSlice.reducer;
