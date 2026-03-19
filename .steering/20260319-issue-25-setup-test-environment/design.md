# 設計書

## アーキテクチャ概要

React + Vite + Vitestによるモダンなテスト環境を構築します。Testing Libraryのベストプラクティスに従い、ユーザー視点でのテストを重視します。

```
┌─────────────────────────────────────────────┐
│         テスト実行環境 (Vitest)              │
├─────────────────────────────────────────────┤
│  @testing-library/react                     │
│  @testing-library/user-event                │
│  @testing-library/jest-dom                  │
├─────────────────────────────────────────────┤
│  モック層                                    │
│  - fake-indexeddb                           │
│  - vi.mock() for APIs                       │
│  - Redux mock store                         │
├─────────────────────────────────────────────┤
│  テスト対象                                  │
│  - Components                               │
│  - Hooks                                    │
│  - Redux Slices                             │
│  - Utils                                    │
└─────────────────────────────────────────────┘
```

## テスト設計原則

### 1. Testing Library のベストプラクティスに従う
- 実装の詳細ではなく、ユーザーの使い方をテスト
- `getByRole`, `getByLabelText`等のセマンティックなクエリを優先
- `data-testid`は最後の手段

### 2. テストピラミッド
```
     E2E (今回はスコープ外)
    /            \
統合テスト (30%)
/                \
ユニットテスト (70%)
```

### 3. AAA Pattern
- **Arrange**: テストデータとモックの準備
- **Act**: テスト対象の関数/コンポーネントを実行
- **Assert**: 期待値との比較

## コンポーネント設計

### 1. テスト設定ファイル(vitest.setup.ts)

**責務**:
- グローバルなモック設定
- Testing Libraryのセットアップ
- カスタムマッチャーの登録

**実装の要点**:
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
});

// グローバルモック
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// localStorage/sessionStorage のモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
global.sessionStorage = localStorageMock as any;
```

### 2. テストユーティリティ(src/utils/test-utils.tsx)

**責務**:
- Reduxストア付きのカスタムrender関数
- ルーター付きのrender関数
- 共通のモックデータ生成

**実装の要点**:
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

interface CustomRenderOptions extends RenderOptions {
  preloadedState?: any;
  store?: any;
  withRouter?: boolean;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { /* ... */ },
      preloadedState,
    }),
    withRouter = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const component = <Provider store={store}>{children}</Provider>;
    return withRouter ? <BrowserRouter>{component}</BrowserRouter> : component;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
```

### 3. モックファクトリー(src/utils/test-factories.ts)

**責務**:
- テストデータの生成
- 一貫性のあるモックオブジェクト作成

**実装の要点**:
```typescript
import { Task, Calendar } from '../types';

export const mockTask = (overrides?: Partial<Task>): Task => ({
  id: 'test-task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'medium',
  createdAt: new Date('2026-03-19'),
  updatedAt: new Date('2026-03-19'),
  ...overrides,
});

export const mockTaskList = (count: number): Task[] =>
  Array.from({ length: count }, (_, i) =>
    mockTask({ id: `test-task-${i + 1}`, title: `Task ${i + 1}` })
  );
```

## データフロー

### コンポーネントテストのフロー
```
1. renderWithProviders()でコンポーネントをレンダリング
2. screen.getByRole()等でDOM要素を取得
3. userEvent.click()等でユーザーイベントをシミュレート
4. screen.queryBy...()で結果を検証
5. expect()でアサーション
```

### Hooksテストのフロー
```
1. renderHook()でhooksをレンダリング
2. result.current経由で値にアクセス
3. act()内でhooksの関数を実行
4. waitFor()で非同期処理の完了を待つ
5. expect()で状態を検証
```

## エラーハンドリング戦略

### テスト内でのエラーハンドリング
```typescript
// ✅ Good
it('should throw ValidationError for invalid input', () => {
  expect(() => validateTask({ title: '' })).toThrow(ValidationError);
});

// ✅ Good (async)
it('should handle API error', async () => {
  const { result } = renderHook(() => useTaskManager());

  await expect(result.current.createTask({ title: '' }))
    .rejects
    .toThrow('Validation failed');
});
```

### エラー表示のテスト
```typescript
it('should display error message on failure', async () => {
  const user = userEvent.setup();
  renderWithProviders(<TaskForm />);

  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);

  expect(await screen.findByRole('alert')).toHaveTextContent('Title is required');
});
```

## テスト戦略

### ユニットテスト

#### コンポーネント
- **対象**: Button, Input, Modal, TaskCard等
- **テスト内容**:
  - Props渡しによる表示変更
  - イベントハンドラーの呼び出し
  - 条件分岐による表示切り替え
  - アクセシビリティ(role, aria-label等)

#### Redux Slices
- **対象**: taskSlice, calendarSlice等
- **テスト内容**:
  - Reducerの状態変更
  - Actionの生成
  - Async thunkの成功/失敗
  - Selectorの値計算

#### Hooks
- **対象**: useTaskManager, useCalendar等
- **テスト内容**:
  - 初期状態
  - 状態更新ロジック
  - 副作用(useEffect)
  - エラーハンドリング

#### Utilities
- **対象**: date.ts, validation.ts等
- **テスト内容**:
  - 正常系の入出力
  - エッジケース
  - エラーケース

### 統合テスト

#### タスク作成フロー
```typescript
describe('Task Creation Flow', () => {
  it('should create a task from UI to store', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskForm />);

    // 入力
    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.selectOptions(screen.getByLabelText(/category/i), '仕事');
    await user.click(screen.getByRole('button', { name: /save/i }));

    // 結果検証
    await waitFor(() => {
      expect(screen.getByText('Task created')).toBeInTheDocument();
    });
  });
});
```

## 依存ライブラリ

既にインストール済み:
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "fake-indexeddb": "^6.2.5",
    "vitest": "^4.0.18"
  }
}
```

追加インストール不要。

## ディレクトリ構造

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx         ← 新規作成
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.test.tsx          ← 新規作成
│   │   │   └── index.ts
│   ├── task/
│   │   ├── TaskCard/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskCard.test.tsx       ← 新規作成
│   │   │   └── index.ts
├── store/
│   ├── slices/
│   │   ├── taskSlice.ts
│   │   ├── taskSlice.test.ts           ← 新規作成
│   │   ├── calendarSlice.ts
│   │   ├── calendarSlice.test.ts       ← 新規作成
├── hooks/
│   ├── useTaskManager.ts
│   ├── useTaskManager.test.ts          ← 新規作成
├── utils/
│   ├── date.ts
│   ├── date.test.ts                    ← 新規作成
│   ├── validation.ts
│   ├── validation.test.ts              ← 新規作成
│   ├── test-utils.tsx                  ← 新規作成
│   └── test-factories.ts               ← 新規作成
└── __tests__/
    ├── integration/                    ← 新規作成
    │   ├── task-creation.test.tsx
    │   └── calendar-navigation.test.tsx
    └── snapshots/                      ← 新規作成
        ├── CalendarView.test.tsx
        └── TaskList.test.tsx

vitest.config.ts                        ← 新規作成
vitest.setup.ts                         ← 新規作成
```

## 実装の順序

1. **テスト基盤の構築**
   - vitest.config.ts作成
   - vitest.setup.ts作成
   - test-utils.tsx作成
   - test-factories.ts作成

2. **ユーティリティテスト**
   - date.test.ts
   - validation.test.ts
   - format.test.ts

3. **コンポーネントテスト**
   - Button.test.tsx
   - Input.test.tsx
   - TaskCard.test.tsx
   - TaskList.test.tsx
   - Modal.test.tsx

4. **Redux Storeテスト**
   - taskSlice.test.ts
   - calendarSlice.test.ts
   - Selectorのテスト

5. **Hooksテスト**
   - useTaskManager.test.ts
   - useCalendar.test.ts

6. **統合テスト**
   - task-creation.test.tsx
   - calendar-navigation.test.tsx

7. **スナップショットテスト**
   - 主要コンポーネントのスナップショット

8. **カバレッジレポート確認と修正**

## セキュリティ考慮事項

- テスト内で本物のAPIキーやシークレットを使用しない
- モックデータに実際のユーザー情報を含めない
- テストファイルをGit管理下に含める(機密情報なし)

## パフォーマンス考慮事項

- テスト実行時間: 10秒以内を目標
- 並列実行を活用(Vitestのデフォルト)
- 重いE2Eテストは別フェーズに分離

## 将来の拡張性

- E2Eテスト(Playwright)の追加
- Visual Regression Testing
- Performance Testing
- Mutation Testing
