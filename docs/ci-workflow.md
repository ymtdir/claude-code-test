# CI/CDワークフロー

## 概要
CI/CDパイプラインでのエラーを防ぐため、ローカルでの事前チェック機構を導入しています。

## チェックコマンド

### 個別チェック
```bash
npm run format:check  # Prettierフォーマットチェック
npm run lint         # ESLintチェック
npm run typecheck    # TypeScriptコンパイルチェック
npm run build        # ビルドチェック
npm run test:run     # テスト実行
```

### 統合チェック
```bash
npm run ci:check     # すべてのチェックを順番に実行（CI環境と同じ）
```

## Git Hooks（自動チェック）

### pre-commit（コミット前）
- lint-stagedを使用して、変更されたファイルのみチェック
- Prettierフォーマットチェック
- ESLintチェック

### pre-push（プッシュ前）
- `npm run ci:check`を実行
- すべてのチェック（format、lint、typecheck、build、test）を実行
- CIと同じ環境でチェックするため、CIエラーを事前に防げる

## 使い方

### 手動チェック（推奨）
プルリクエストを作成する前に実行:
```bash
npm run ci:check
```

### 自動チェック
Git hooksが自動的に以下を実行:
- `git commit`: ステージングファイルのフォーマット・lintチェック
- `git push`: 全体のCI前チェック

### チェックをスキップする場合（非推奨）
緊急時のみ使用:
```bash
git commit --no-verify  # pre-commitをスキップ
git push --no-verify    # pre-pushをスキップ
```

## トラブルシューティング

### huskyが動作しない場合
```bash
npm run prepare  # huskyを再インストール
```

### 権限エラーが出る場合
```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```