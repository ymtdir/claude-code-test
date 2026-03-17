# 設計書

## アーキテクチャ概要

### システム構成
```
┌─────────────────────────────────────┐
│     UI Layer (React Components)      │
├─────────────────────────────────────┤
│   NotificationService (Web API)      │
├─────────────────────────────────────┤
│     Storage (IndexedDB/Redux)        │
└─────────────────────────────────────┘
```

## コンポーネント設計

### 1. NotificationService
```typescript
// src/services/NotificationService.ts
class NotificationService {
  // 権限リクエスト
  requestPermission(): Promise<boolean>

  // 通知スケジューリング
  scheduleNotification(task: Task, reminder: Reminder): void

  // 通知キャンセル
  cancelNotification(notificationId: string): void

  // スヌーズ処理
  snoozeNotification(taskId: string, minutes: number): void
}
```

### 2. ReminderSettings Component
```typescript
// src/components/ReminderSettings.tsx
interface ReminderSettingsProps {
  task: Task;
  onUpdate: (reminders: Reminder[]) => void;
}
```

### 3. NotificationHandler
```typescript
// src/utils/NotificationHandler.ts
class NotificationHandler {
  // 通知クリック時の処理
  handleNotificationClick(event: NotificationEvent): void

  // アクションボタンの処理
  handleAction(action: string, taskId: string): void
}
```

## データモデル

### Reminder
```typescript
interface Reminder {
  id: string;
  taskId: string;
  type: 'time' | 'repeat';
  timeOffset?: number; // 分単位（マイナスは事前通知）
  repeatRule?: RepeatRule;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RepeatRule {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval?: number;
  daysOfWeek?: number[]; // 0-6 (日-土)
  dayOfMonth?: number;
}
```

## ブラウザ通知APIの使用

### Notification API
```javascript
// 権限確認
if (Notification.permission === "granted") {
  // 通知作成
  const notification = new Notification(title, {
    body: message,
    icon: '/icon.png',
    badge: '/badge.png',
    tag: taskId,
    requireInteraction: true,
    actions: [
      { action: 'complete', title: '完了' },
      { action: 'snooze', title: 'スヌーズ' }
    ]
  });
}
```

### Service Worker（PWA対応）
```javascript
// sw.js
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // アクション処理
  if (event.action === 'complete') {
    // タスク完了処理
  }
});
```

## 実装順序

### フェーズ1: 基本機能
1. NotificationServiceの実装
2. 権限リクエスト機能
3. 基本的な通知表示

### フェーズ2: リマインダー設定
1. ReminderSettings UIの実装
2. データモデルの定義
3. Redux統合

### フェーズ3: 通知スケジューリング
1. 時間ベース通知の実装
2. 事前通知の実装
3. 繰り返し通知の実装

### フェーズ4: 通知ハンドリング
1. 通知クリック処理
2. アクションボタン処理
3. スヌーズ機能

### フェーズ5: PWA対応
1. Service Workerの設定
2. バックグラウンド通知
3. オフライン対応

## 技術選定理由

### Web Notification API
- ブラウザ標準API
- React Native Webとの親和性
- クロスブラウザ対応

### Service Worker
- バックグラウンド処理
- オフライン対応
- プッシュ通知の基盤

### IndexedDB
- リマインダー設定の永続化
- オフライン時のデータ保持
- 大容量データの保存

## セキュリティ考慮事項

- HTTPS環境でのみ動作（Notification API要件）
- 権限リクエストは明示的にユーザー操作後に実行
- 通知内容に機密情報を含めない

## テスト戦略

### ユニットテスト
- NotificationServiceのメソッドテスト
- リマインダー設定のロジックテスト

### 統合テスト
- 通知スケジューリングの動作確認
- Redux統合のテスト

### 手動テスト
- 実際の通知表示確認
- 各種ブラウザでの動作確認