/**
 * モックタスクデータ
 * 開発・テスト用のサンプルデータ
 */

export interface Task {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:mm format
  completed: boolean;
  categoryId: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

// カテゴリーデータ
export const mockCategories: Category[] = [
  { id: 'work', name: '仕事', color: '#4A90E2' },
  { id: 'personal', name: 'プライベート', color: '#4ECDC4' },
  { id: 'household', name: '家事', color: '#FFD93D' },
  { id: 'meeting', name: '会議', color: '#FF6B6B' },
  { id: 'study', name: '学習', color: '#95A5A6' },
];

// 2026年3月のモックタスク
export const mockTasks: Task[] = [
  // 3月1日
  {
    id: '1',
    title: 'プロジェクトキックオフミーティング',
    date: '2026-03-01',
    time: '10:00',
    completed: false,
    categoryId: 'meeting',
    priority: 'high',
  },
  {
    id: '2',
    title: '月次レポート作成',
    date: '2026-03-01',
    time: '14:00',
    completed: false,
    categoryId: 'work',
    priority: 'medium',
  },
  // 3月2日
  {
    id: '3',
    title: '買い物リストを作る',
    date: '2026-03-02',
    completed: false,
    categoryId: 'household',
    priority: 'low',
  },
  {
    id: '4',
    title: 'ジムに行く',
    date: '2026-03-02',
    time: '18:00',
    completed: false,
    categoryId: 'personal',
    priority: 'medium',
  },
  // 3月5日 (今日と想定)
  {
    id: '5',
    title: '会議資料の準備',
    date: '2026-03-05',
    time: '10:00',
    completed: false,
    categoryId: 'work',
    priority: 'high',
  },
  {
    id: '6',
    title: 'メール返信',
    date: '2026-03-05',
    time: '11:00',
    completed: true,
    categoryId: 'work',
    priority: 'medium',
  },
  {
    id: '7',
    title: 'レポート作成',
    date: '2026-03-05',
    time: '14:00',
    completed: false,
    categoryId: 'work',
    priority: 'high',
  },
  {
    id: '8',
    title: 'React Native学習',
    date: '2026-03-05',
    time: '19:00',
    completed: false,
    categoryId: 'study',
    priority: 'medium',
  },
  {
    id: '9',
    title: '掃除',
    date: '2026-03-05',
    completed: false,
    categoryId: 'household',
    priority: 'low',
  },
  // 3月10日
  {
    id: '10',
    title: '定例会議',
    date: '2026-03-10',
    time: '15:00',
    completed: false,
    categoryId: 'meeting',
    priority: 'medium',
  },
  {
    id: '11',
    title: '請求書処理',
    date: '2026-03-10',
    completed: false,
    categoryId: 'work',
    priority: 'high',
  },
  // 3月15日
  {
    id: '12',
    title: '健康診断',
    date: '2026-03-15',
    time: '09:00',
    completed: false,
    categoryId: 'personal',
    priority: 'high',
  },
  {
    id: '13',
    title: 'チームビルディング',
    date: '2026-03-15',
    time: '14:00',
    completed: false,
    categoryId: 'meeting',
    priority: 'medium',
  },
  // 3月20日
  {
    id: '14',
    title: '春分の日',
    date: '2026-03-20',
    completed: false,
    categoryId: 'personal',
    priority: 'low',
  },
  {
    id: '15',
    title: '家族とのお出かけ',
    date: '2026-03-20',
    time: '10:00',
    completed: false,
    categoryId: 'personal',
    priority: 'medium',
  },
  // 3月25日
  {
    id: '16',
    title: '四半期レビュー準備',
    date: '2026-03-25',
    completed: false,
    categoryId: 'work',
    priority: 'high',
  },
  {
    id: '17',
    title: '新機能のデモ',
    date: '2026-03-25',
    time: '16:00',
    completed: false,
    categoryId: 'meeting',
    priority: 'high',
  },
  // 3月31日
  {
    id: '18',
    title: '月末締め作業',
    date: '2026-03-31',
    completed: false,
    categoryId: 'work',
    priority: 'high',
  },
  {
    id: '19',
    title: '振り返り会議',
    date: '2026-03-31',
    time: '17:00',
    completed: false,
    categoryId: 'meeting',
    priority: 'medium',
  },
];

/**
 * 指定日のタスクを取得
 * @param date YYYY-MM-DD形式の日付文字列
 */
export const getTasksByDate = (date: string): Task[] => {
  return mockTasks.filter((task) => task.date === date);
};

/**
 * 日付ごとのタスク数を取得
 * @returns 日付をキー、タスク数を値とするオブジェクト
 */
export const getTaskCountByDate = (): Record<string, number> => {
  const taskCount: Record<string, number> = {};
  mockTasks.forEach((task) => {
    taskCount[task.date] = (taskCount[task.date] || 0) + 1;
  });
  return taskCount;
};

/**
 * タスクの完了状態を更新
 * @param taskId タスクID
 * @param completed 完了状態
 */
export const updateTaskCompletion = (
  taskId: string,
  completed: boolean
): void => {
  const task = mockTasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = completed;
  }
};

/**
 * タスクを翌日に延期
 * @param taskId タスクID
 */
export const postponeTask = (taskId: string): void => {
  const task = mockTasks.find((t) => t.id === taskId);
  if (task) {
    const currentDate = new Date(task.date);
    currentDate.setDate(currentDate.getDate() + 1);
    task.date = currentDate.toISOString().split('T')[0];
  }
};
