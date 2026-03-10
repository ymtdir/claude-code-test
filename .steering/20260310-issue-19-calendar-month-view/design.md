# 設計書

## アーキテクチャ概要

コンポーネントベースのアーキテクチャを採用し、再利用性と保守性を重視します。画面コンポーネント（screens）と共通コンポーネント（components）を明確に分離し、React Hooksによる状態管理を行います。

```
┌─────────────────────────────────────────┐
│       MonthViewScreen (画面)            │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │     CalendarHeader              │   │
│  │  (月選択・ナビゲーション)         │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │     CalendarGrid                │   │
│  │  (カレンダー本体)                │   │
│  │  - 六曜表示                     │   │
│  │  - 祝日表示                     │   │
│  │  - タスク数バッジ               │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │     ProgressBar                 │   │
│  │  (タスク完了率)                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │     TodayTaskList               │   │
│  │  (タスクリスト)                  │   │
│  │  - TaskItem × n                 │   │
│  │  - AddTaskButton                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## コンポーネント設計

### 1. MonthViewScreen

**責務**:
- 画面全体のレイアウト管理
- 選択日付の状態管理
- 子コンポーネントへのデータ供給

**実装の要点**:
- useStateで選択日付を管理
- useEffectでタスクデータを取得
- カスタムフックuseCalendarDataで六曜・祝日データを管理

### 2. CalendarGrid

**責務**:
- react-native-calendarsのラッパー
- カスタムスタイルの適用
- 日付装飾（六曜・祝日・タスク数）の管理

**実装の要点**:
- markedDatesプロパティで日付の装飾を管理
- カスタムDayComponentで六曜表示を実装
- パフォーマンスのためメモ化を活用

### 3. TodayTaskList

**責務**:
- タスクリストの表示
- スワイプジェスチャーの処理
- タスク完了/延期の処理

**実装の要点**:
- FlatListで効率的なリスト表示
- react-native-gesture-handlerでスワイプ実装
- react-native-reanimatedでアニメーション処理

### 4. ProgressBar

**責務**:
- タスク完了率の計算
- プログレスバーの表示
- アニメーション管理

**実装の要点**:
- Animated APIを使用した滑らかなアニメーション
- 完了率に応じた色の変化

## データフロー

### タスク完了フロー
```
1. ユーザーがタスクを右スワイプ
2. TaskItemがonCompleteコールバックを発火
3. TodayTaskListがタスクの状態を更新
4. ProgressBarが完了率を再計算
5. アニメーション再生
6. 振動フィードバック発生
```

### カレンダー月切り替えフロー
```
1. ユーザーがカレンダーを左右スワイプ
2. CalendarGridがonMonthChangeを発火
3. MonthViewScreenが表示月を更新
4. 新しい月のタスクデータを取得
5. 各コンポーネントを再レンダリング
```

## エラーハンドリング戦略

### カスタムエラークラス

```typescript
class CalendarDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalendarDataError';
  }
}

class TaskOperationError extends Error {
  constructor(message: string, operation: 'complete' | 'postpone') {
    super(message);
    this.name = 'TaskOperationError';
  }
}
```

### エラーハンドリングパターン

- データ取得エラー: 再試行ボタンを表示
- タスク操作エラー: トースト通知でエラーメッセージ表示
- 日付計算エラー: フォールバックデータを使用

## テスト戦略

### ユニットテスト
- 六曜計算ロジックのテスト
- 祝日判定ロジックのテスト
- タスク完了率計算のテスト
- 日付フォーマット関数のテスト

### 統合テスト
- カレンダー表示とタスクリストの連動
- スワイプジェスチャーとタスク状態更新
- 月切り替えとデータ取得

## 依存ライブラリ

```json
{
  "dependencies": {
    "react-native-calendars": "^1.1300.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-reanimated": "^3.6.0",
    "date-fns": "^3.0.0",
    "react-native-haptic-feedback": "^2.2.0"
  }
}
```

## ディレクトリ構造

```
src/
├── screens/
│   └── Calendar/
│       ├── MonthViewScreen.tsx
│       └── MonthViewScreen.styles.ts
├── components/
│   └── calendar/
│       ├── CalendarGrid/
│       │   ├── CalendarGrid.tsx
│       │   ├── CalendarGrid.styles.ts
│       │   └── index.ts
│       ├── TodayTaskList/
│       │   ├── TodayTaskList.tsx
│       │   ├── TodayTaskList.styles.ts
│       │   ├── TaskItem.tsx
│       │   └── index.ts
│       └── ProgressBar/
│           ├── ProgressBar.tsx
│           ├── ProgressBar.styles.ts
│           └── index.ts
├── utils/
│   ├── calendar/
│   │   ├── rokuyou.ts      # 六曜計算
│   │   ├── holidays.ts     # 祝日データ
│   │   └── index.ts
│   └── date.ts
├── hooks/
│   └── useCalendarData.ts
├── mocks/
│   └── taskData.ts
└── constants/
    └── calendar.ts
```

## 実装の順序

1. 必要なライブラリのインストールと設定
2. モックデータの作成
3. 基本的なカレンダー表示の実装
4. タスクリストコンポーネントの実装
5. プログレスバーの実装
6. 六曜・祝日表示機能の追加
7. スワイプジェスチャーの実装
8. アニメーションとフィードバックの追加
9. 全体の統合とテスト

## セキュリティ考慮事項

- ユーザー入力のサニタイゼーション
- タスクデータのプライバシー保護
- 適切なエラーメッセージ（詳細情報の露出防止）

## パフォーマンス考慮事項

- FlatListによる仮想化リスト
- React.memoによるコンポーネントのメモ化
- useMemoによる計算結果のキャッシュ
- 画像・アイコンの最適化
- 不要な再レンダリングの防止

## 将来の拡張性

- カレンダービュー切り替え（週表示・日表示）のための基盤
- カスタムテーマ対応のためのスタイル分離
- 国際化対応のための文字列外部化準備
- プラグイン可能なタスクアクション