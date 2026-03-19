# 要求内容

## 概要

UnifiedCalアプリの品質保証のため、Vitest + React Testing Libraryによる包括的なテスト戦略を実装します。ユニットテスト、統合テスト、スナップショットテストの環境を構築し、高いテストカバレッジを実現します。

## 背景

### 現状の問題
- プロジェクトは既にVitestがインストールされているが、テストファイルがまだ作成されていない
- コンポーネント、hooks、ユーティリティ関数のテストが不足
- テストカバレッジの目標値(60%)が設定されていない
- CI環境でのテスト自動実行が構成されていない

### プロジェクトの技術スタック
- **フレームワーク**: React 19.2.0 (react-native-web経由でReact Nativeライブラリを利用)
- **ビルドツール**: Vite 7.3.1
- **テストランナー**: Vitest 4.0.18 (既にインストール済み)
- **状態管理**: Redux Toolkit 2.11.2
- **ルーティング**: React Router DOM 6.30.3

## 実装対象の機能

### 1. Vitestテスト設定の最適化
- vitest.config.tsの作成または最適化
- カバレッジレポート設定
- テストセットアップファイル(vitest.setup.ts)の作成
- モック設定(localStorage, IndexedDB, etc.)

### 2. コンポーネントテストの作成
- 共通UIコンポーネントのテスト
  - Button, Input, Modal等の基本コンポーネント
- タスク関連コンポーネントのテスト
  - TaskCard, TaskList, TaskForm等
- カレンダー関連コンポーネントのテスト

### 3. Redux Storeテストの作成
- Sliceのテスト(reducers, actions)
- Selectorのテスト
- Middlewareのテスト(async thunk含む)

### 4. カスタムHooksのテスト
- @testing-library/reactのrenderHookを使用
- useTaskManager, useCalendar等のテスト

### 5. ユーティリティ関数のテスト
- 日付処理関数のテスト
- バリデーション関数のテスト
- フォーマット関数のテスト

### 6. 統合テストの作成
- ユーザーフロー全体のテスト
- API連携のテスト(モック使用)
- データベース操作のテスト(fake-indexeddb使用)

### 7. スナップショットテストの作成
- 主要コンポーネントの視覚的回帰テスト
- レイアウトコンポーネントのテスト

### 8. テストスクリプトの整備
- package.jsonに必要なスクリプトを追加
- CI/CDでの自動実行設定

## 受け入れ条件

### Vitest設定
- [ ] vitest.config.tsが正しく設定されている
- [ ] テストカバレッジ閾値が設定されている(60%)
- [ ] vitest.setup.tsでグローバルなモック設定が完了している

### コンポーネントテスト
- [ ] 最低5つの主要コンポーネントのテストが作成されている
- [ ] ユーザーインタラクションのテストが含まれている
- [ ] アクセシビリティのテストが含まれている

### Redux Storeテスト
- [ ] 最低3つのSliceのテストが作成されている
- [ ] Async thunkのテストが含まれている
- [ ] Selectorのテストが含まれている

### カスタムHooksテスト
- [ ] 最低3つのカスタムhooksのテストが作成されている
- [ ] 非同期処理のテストが含まれている

### ユーティリティテスト
- [ ] utils/内の主要関数のテストが作成されている
- [ ] エッジケースのテストが含まれている

### 統合テスト
- [ ] 最低2つの主要ユーザーフローの統合テストが作成されている
- [ ] データベース操作の統合テストが含まれている

### スナップショットテスト
- [ ] 主要画面のスナップショットテストが作成されている

### テスト実行
- [ ] `npm test`でテストが実行できる
- [ ] `npm run test:run`で全テストが実行できる
- [ ] カバレッジレポートが生成される
- [ ] 全テストがパスする

## 成功指標

- テストカバレッジ: 全体で60%以上
  - Statements: 60%
  - Branches: 60%
  - Functions: 60%
  - Lines: 60%
- テスト実行時間: 10秒以内(全テスト)
- CI環境での自動テスト実行が成功

## スコープ外

以下はこのフェーズでは実装しません:

- E2Eテスト(Playwright, Cypress等)
  - 理由: まずはユニット・統合テストを確立
- Visual Regression Testing
  - 理由: CI環境の構築が先
- Mutation Testing
  - 理由: 基本的なテストカバレッジ達成が優先
- Performance Testing
  - 理由: 機能テストの完成が先

## 参照ドキュメント

- `docs/product-requirements.md` - プロダクト要求定義書
- `docs/functional-design.md` - 機能設計書
- `docs/architecture.md` - アーキテクチャ設計書
- `docs/development-guidelines.md` - 開発ガイドライン(テスト戦略含む)
- `docs/repository-structure.md` - リポジトリ構造定義書

## 注意事項

このプロジェクトは**React + Vite + react-native-web**の構成であり、純粋なReact Nativeアプリではありません。したがって:
- Jestではなく、既にインストール済みのVitestを使用
- React Native Testing Libraryではなく、@testing-library/reactを使用
- react-test-rendererではなく、Vitestのスナップショット機能を使用
- Detox等のモバイルE2Eツールは使用しない
