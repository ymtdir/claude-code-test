# 設計

## 選定技術

### データベース選定: IndexedDB + Dexie.js

**WatermelonDBではなくIndexedDB + Dexieを選択した理由:**

1. **プロジェクトの性質**: React Web アプリケーション（React Native ではない）
2. **WatermelonDBの問題**: React Native向けに設計されており、Webでは制限が多い
3. **IndexedDBの利点**: ブラウザネイティブで全ブラウザサポート
4. **Dexie.jsの利点**:
   - TypeScript完全対応
   - ReactiveなObservable対応
   - シンプルなAPI
   - 優れたパフォーマンス

## アーキテクチャ設計

### レイヤー構造

```
src/
  database/
    schema/           # スキーマ定義
    models/           # モデルクラス
    migrations/       # マイグレーション
    index.ts          # データベース初期化
  repositories/       # リポジトリパターン
  hooks/             # React hooks
```

### データフロー

```
Component → Hook → Repository → Dexie → IndexedDB
```

## スキーマ設計

### tasksテーブル

| カラム名 | 型 | 必須 | インデックス | 説明 |
|---------|---|------|------------|------|
| id | string | ✓ | Primary | UUID |
| title | string | ✓ | - | タスク名 |
| category | string | ✓ | ✓ | カテゴリ |
| date | Date | ✓ | ✓ | 実行日 |
| time | string | - | - | 時刻 |
| priority | string | ✓ | - | 優先度 |
| status | string | ✓ | ✓ | ステータス |
| completedAt | Date | - | - | 完了日時 |
| note | string | - | - | メモ |
| createdAt | Date | ✓ | - | 作成日時 |
| updatedAt | Date | ✓ | - | 更新日時 |

### calendarsテーブル

| カラム名 | 型 | 必須 | インデックス | 説明 |
|---------|---|------|------------|------|
| id | string | ✓ | Primary | UUID |
| name | string | ✓ | - | カレンダー名 |
| color | string | ✓ | - | 色コード |
| isDefault | boolean | ✓ | - | デフォルトフラグ |

### remindersテーブル

| カラム名 | 型 | 必須 | インデックス | 説明 |
|---------|---|------|------------|------|
| id | string | ✓ | Primary | UUID |
| taskId | string | ✓ | ✓ | タスクID |
| type | string | ✓ | - | リマインダー種別 |
| timeOffset | number | - | - | 時間オフセット |
| isActive | boolean | ✓ | - | 有効フラグ |

## 実装詳細

### 1. Dexieデータベースクラス

```typescript
import Dexie, { Table } from 'dexie';

class UnifiedCalDatabase extends Dexie {
  tasks!: Table<TaskModel>;
  calendars!: Table<CalendarModel>;
  reminders!: Table<ReminderModel>;

  constructor() {
    super('UnifiedCalDB');
    this.version(1).stores({
      tasks: 'id, category, date, status, [date+status]',
      calendars: 'id',
      reminders: 'id, taskId'
    });
  }
}
```

### 2. リポジトリパターン

```typescript
export class TaskRepository {
  private db: UnifiedCalDatabase;

  constructor(db: UnifiedCalDatabase) {
    this.db = db;
  }

  async findByDate(date: Date): Promise<TaskModel[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.db.tasks
      .where('date')
      .between(startOfDay, endOfDay)
      .toArray();
  }
}
```

### 3. React Hooks

```typescript
export function useTasks(date?: Date) {
  const [tasks, setTasks] = useState<TaskModel[]>([]);

  useEffect(() => {
    const subscription = db.tasks
      .where('date')
      .equals(date || new Date())
      .watch()
      .subscribe(setTasks);

    return () => subscription.unsubscribe();
  }, [date]);

  return tasks;
}
```

## エラーハンドリング

### データベース初期化エラー

```typescript
try {
  await db.open();
} catch (error) {
  console.error('Database initialization failed:', error);
  // フォールバック: LocalStorageを使用
}
```

### トランザクションエラー

```typescript
try {
  await db.transaction('rw', db.tasks, async () => {
    // トランザクション処理
  });
} catch (error) {
  // ロールバック自動
  throw new DatabaseError('Transaction failed', error);
}
```

## パフォーマンス最適化

1. **インデックス戦略**
   - date, status, categoryに複合インデックス
   - 頻繁なクエリパターンに最適化

2. **バッチ処理**
   - 複数タスクの一括作成/更新
   - トランザクション内で処理

3. **遅延読み込み**
   - 必要な日付範囲のみ取得
   - ページネーション実装

## テスト戦略

1. **ユニットテスト**
   - リポジトリメソッドのテスト
   - モデルバリデーションテスト

2. **統合テスト**
   - CRUD操作の統合テスト
   - トランザクションテスト

3. **パフォーマンステスト**
   - 100件のタスクで1秒以内
   - 同時アクセステスト

## 移行計画

1. **既存データの移行**
   - LocalStorageからの移行スクリプト
   - データ整合性チェック

2. **段階的移行**
   - 新規データをIndexedDBに保存
   - 既存データを徐々に移行

## リスクと対策

| リスク | 影響 | 対策 |
|-------|-----|------|
| ブラウザ互換性 | 一部ブラウザで動作しない | ポリフィル使用 |
| ストレージ制限 | データ保存失敗 | 古いデータの自動削除 |
| データ破損 | アプリ動作不能 | 定期バックアップ |

## 今後の拡張性

1. **同期機能**
   - クラウドバックエンド追加時の同期
   - オフライン/オンライン切り替え

2. **エクスポート機能**
   - JSON/CSV形式でのエクスポート
   - バックアップ機能

3. **暗号化**
   - 機密データの暗号化
   - ユーザー認証との連携