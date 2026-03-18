/**
 * ルートリデューサー
 * 全てのSliceを統合
 */

import { combineReducers } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import calendarReducer from './slices/calendarSlice';
import syncReducer from './slices/syncSlice';
import reminderReducer from './slices/reminderSlice';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  calendar: calendarReducer,
  sync: syncReducer,
  reminder: reminderReducer,
});

export default rootReducer;
