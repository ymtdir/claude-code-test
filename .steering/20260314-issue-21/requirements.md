# 要求内容

## Issue番号
#21

## 概要
タスクデータを永続化するためのローカルデータベースを実装します。WatermelonDBまたはSQLiteを使用して、オフラインでもデータが保持される仕組みを構築します。

## 実装内容

### 1. WatermelonDBのインストールと設定
```bash
npm install @nozbe/watermelondb
npm install @nozbe/with-observables
```

### 2. データベーススキーマ定義
```typescript
// src/database/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'date', type: 'number' },
        { name: 'time', type: 'string', isOptional: true },
        { name: 'priority', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'note', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: 'calendars',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'is_default', type: 'boolean' }
      ]
    }),
    tableSchema({
      name: 'reminders',
      columns: [
        { name: 'task_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'time_offset', type: 'number', isOptional: true },
        { name: 'is_active', type: 'boolean' }
      ]
    })
  ]
});
```

### 3. モデルクラスの定義
```typescript
// src/database/models/Task.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class Task extends Model {
  static table = 'tasks';

  @field('title') title!: string;
  @field('category') category!: string;
  @date('date') date!: Date;
  @field('time') time?: string;
  @field('priority') priority!: string;
  @field('status') status!: string;
  @date('completed_at') completedAt?: Date;
  @field('note') note?: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  async markAsCompleted() {
    await this.update(task => {
      task.status = 'completed';
      task.completedAt = new Date();
    });
  }
}
```

### 4. データベース初期化
```typescript
// src/database/index.ts
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { Task } from './models/Task';
import { Calendar } from './models/Calendar';
import { Reminder } from './models/Reminder';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'unifiedcal',
  jsi: true, // iOS向けのパフォーマンス最適化
});

export const database = new Database({
  adapter,
  modelClasses: [Task, Calendar, Reminder],
});
```

### 5. リポジトリパターンの実装
```typescript
// src/repositories/TaskRepository.ts
import { database } from '../database';
import { Task } from '../database/models/Task';
import { Q } from '@nozbe/watermelondb';

export class TaskRepository {
  static async findAll(): Promise {
    return await database.collections.get('tasks').query().fetch();
  }

  static async findByDate(date: Date): Promise {
    return await database.collections
      .get('tasks')
      .query(Q.where('date', date.getTime()))
      .fetch();
  }

  static async create(data: Partial): Promise {
    return await database.write(async () => {
      return await database.collections
        .get('tasks')
        .create(task => {
          Object.assign(task, data);
        });
    });
  }

  static async update(id: string, data: Partial): Promise {
    const task = await database.collections
      .get('tasks')
      .find(id);

    return await database.write(async () => {
      return await task.update(t => {
        Object.assign(t, data);
      });
    });
  }

  static async delete(id: string): Promise {
    const task = await database.collections
      .get('tasks')
      .find(id);

    await database.write(async () => {
      await task.markAsDeleted();
    });
  }
}
```

### 6. データベースフック
```typescript
// src/hooks/useDatabase.ts
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Task } from '../database/models/Task';

export function useTasks(date?: Date) {
  const database = useDatabase();

  return useObservable(() => {
    const collection = database.collections.get('tasks');

    if (date) {
      return collection
        .query(Q.where('date', date.getTime()))
        .observe();
    }

    return collection.query().observe();
  }, [date]);
}
```

### 7. マイグレーション設定
```typescript
// src/database/migrations.ts
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    // 将来のマイグレーション用
  ],
});
```

## 受け入れ条件

- [ ] WatermelonDB/SQLiteが正しく設定されている
- [ ] タスクデータが永続化される
- [ ] アプリ再起動後もデータが保持される
- [ ] タスクのCRUD操作がデータベースに反映される
- [ ] 日付でタスクを検索できる
- [ ] リアクティブな更新が動作する（Observables）
- [ ] パフォーマンスが良好（100件のタスクで1秒以内）

## 必要な技術/ライブラリ

- @nozbe/watermelondb
- @nozbe/with-observables
- react-native-sqlite-storage（代替案）

## 依存関係

- #15 【Step 1】開発環境セットアップが完了していること
- #16 【Step 2】基本プロジェクト構造が完了していること
- #20 【Step 6】タスク追加・編集機能が完了していること

## 参考リンク

- [WatermelonDB Documentation](https://nozbe.github.io/WatermelonDB/)
- [SQLite for React Native](https://github.com/andpor/react-native-sqlite-storage)

## 成果物

- 設定済みのWatermelonDB/SQLite
- データベーススキーマ
- モデルクラス
- リポジトリクラス
- データベースフック
- 動作するデータ永続化機能