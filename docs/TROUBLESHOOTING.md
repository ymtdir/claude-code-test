# トラブルシューティングガイド

このドキュメントでは、開発中に遭遇しやすい問題とその解決方法を説明します。

## 目次

- [ビルドエラー](#ビルドエラー)
- [開発サーバー](#開発サーバー)
- [テスト実行](#テスト実行)
- [環境変数](#環境変数)
- [その他の問題](#その他の問題)

## ビルドエラー

### Vite: モジュール解決エラー

**症状**: `Cannot find module` や `Failed to resolve import` エラーが表示される

**原因**:
- 依存関係のインストール漏れ
- node_modules のキャッシュ破損
- TypeScript の型定義ファイルの問題

**解決方法**:

```bash
# node_modules を完全に削除して再インストール
rm -rf node_modules package-lock.json
npm install

# Vite のキャッシュをクリア
rm -rf node_modules/.vite
npm run dev
```

### TypeScript 型エラー

**症状**: `Type 'X' is not assignable to type 'Y'` などの型エラー

**原因**:
- 型定義の不整合
- 依存パッケージの型定義更新

**解決方法**:

```bash
# 型チェックを実行して詳細を確認
npm run typecheck

# @types パッケージを最新化
npm update @types/react @types/react-dom @types/node
```

### 依存関係のインストール問題

**症状**: `npm install` が失敗する、または依存関係の競合エラー

**原因**:
- package-lock.json の破損
- npm のキャッシュ問題
- Node.js バージョンの不一致

**解決方法**:

```bash
# npm キャッシュをクリア
npm cache clean --force

# package-lock.json を削除して再生成
rm -rf node_modules package-lock.json
npm install

# Node.js バージョンを確認
node -v  # v25.2.1 を推奨
```

## 開発サーバー

### ポート使用中エラー

**症状**: `Error: listen EADDRINUSE: address already in use :::5173`

**原因**: 既に別のプロセスがポート 5173 を使用している

**解決方法**:

```bash
# macOS/Linux: ポート 5173 を使用しているプロセスを終了
lsof -ti:5173 | xargs kill -9

# または別のポートで起動
PORT=3000 npm run dev
```

### HMR（Hot Module Replacement）が動作しない

**症状**: コードを変更してもブラウザが自動更新されない

**原因**:
- ファイルウォッチャーの制限
- ブラウザのキャッシュ
- WebSocket 接続の問題

**解決方法**:

```bash
# 開発サーバーを再起動
# Ctrl+C で停止してから
npm run dev

# ブラウザのキャッシュをクリア（開発者ツールで Cmd+Shift+R）
```

### ブラウザで表示されない

**症状**: `http://localhost:5173` にアクセスしても何も表示されない

**原因**:
- JavaScript エラーでアプリが起動していない
- ビルドエラー
- ブラウザの互換性

**解決方法**:

```bash
# ターミナルでエラーログを確認
# ブラウザのコンソール（F12）でエラーを確認

# ビルドエラーがないか確認
npm run build

# 別のブラウザで試す（Chrome、Firefox、Safari）
```

## テスト実行

### Vitest 設定エラー

**症状**: `Error: Cannot find module 'vitest/config'` などの設定エラー

**原因**:
- vitest のインストール漏れ
- vitest.config.ts の設定ミス

**解決方法**:

```bash
# vitest を再インストール
npm install --save-dev vitest @vitest/coverage-v8

# 設定ファイルを確認
cat vitest.config.ts

# テストを実行
npm test
```

### テストがタイムアウトする

**症状**: `Test timeout of 5000ms exceeded` エラー

**原因**:
- 非同期処理の待機漏れ
- 無限ループ
- データベース接続の問題

**解決方法**:

```typescript
// テストのタイムアウトを延長
test('時間がかかる処理', async () => {
  // ...
}, 10000); // 10秒に延長

// または vitest.config.ts でグローバル設定
export default defineConfig({
  test: {
    testTimeout: 10000,
  },
});
```

### カバレッジ生成の問題

**症状**: `npm run test:run -- --coverage` でカバレッジが生成されない

**原因**:
- @vitest/coverage-v8 のインストール漏れ
- coverage ディレクトリの権限問題

**解決方法**:

```bash
# カバレッジツールをインストール
npm install --save-dev @vitest/coverage-v8

# 既存の coverage ディレクトリを削除
rm -rf coverage

# カバレッジ付きでテスト実行
npm run test:run -- --coverage
```

## 環境変数

### .env ファイルが読み込まれない

**症状**: `import.meta.env.VITE_API_URL` が undefined

**原因**:
- .env ファイルの配置場所が間違っている
- 環境変数名が `VITE_` で始まっていない
- 開発サーバーの再起動が必要

**解決方法**:

```bash
# .env ファイルをプロジェクトルートに配置
# ファイル名: .env

# 環境変数は VITE_ で始める必要がある
VITE_API_URL=https://api.example.com

# 開発サーバーを再起動
# Ctrl+C で停止してから
npm run dev
```

### 環境変数の優先順位

**症状**: 環境変数の値が期待通りにならない

**原因**: 複数の .env ファイルがある場合の優先順位

**優先順位（高 → 低）**:
1. `.env.local` (すべての環境で優先、Git にコミットしない)
2. `.env.[mode].local` (特定モードで優先、Git にコミットしない)
3. `.env.[mode]` (特定モード用)
4. `.env` (デフォルト)

**解決方法**:

```bash
# 不要な .env ファイルを削除
# または環境変数の値を確認
echo $VITE_API_URL
```

## その他の問題

### ESLint エラー

**症状**: `ESLint: Parsing error` や警告が大量に表示される

**原因**:
- eslint.config.js の設定ミス
- ESLint プラグインのバージョン不整合

**解決方法**:

```bash
# ESLint を実行して詳細を確認
npm run lint

# ESLint キャッシュをクリア
rm -rf node_modules/.cache/eslint

# ESLint 関連パッケージを再インストール
npm install --save-dev eslint @eslint/js typescript-eslint
```

### Git pre-commit フックの問題

**症状**: `git commit` が失敗する、または Husky が動作しない

**原因**:
- Husky のインストール不足
- pre-commit スクリプトのエラー
- lint-staged の設定ミス

**解決方法**:

```bash
# Husky を再インストール
npm install --save-dev husky
npm run prepare

# pre-commit フックを確認
cat .husky/pre-commit

# lint-staged を手動実行してエラー確認
npx lint-staged

# フックをスキップしてコミット（推奨しない）
git commit --no-verify -m "message"
```

### Prettier フォーマットエラー

**症状**: `npm run format:check` が失敗する

**原因**:
- コードフォーマットが Prettier の規約に違反
- .prettierrc の設定ミス

**解決方法**:

```bash
# 自動フォーマットを実行
npm run format

# 特定のファイルのみフォーマット
npx prettier --write src/path/to/file.ts

# フォーマットチェックのみ
npm run format:check
```

## さらにサポートが必要な場合

上記の解決方法で問題が解決しない場合:

1. [GitHub Issues](https://github.com/ymtdir/claude-code-test/issues) で既存の Issue を検索
2. 新しい Issue を作成（問題の詳細、エラーメッセージ、環境情報を含める）
3. [CONTRIBUTING.md](./CONTRIBUTING.md) を参照して適切な報告方法を確認

## 関連ドキュメント

- [README.md](../README.md) - プロジェクト概要とセットアップ
- [CONTRIBUTING.md](./CONTRIBUTING.md) - コントリビューションガイド
- [development-guidelines.md](./development-guidelines.md) - 開発ガイドライン
