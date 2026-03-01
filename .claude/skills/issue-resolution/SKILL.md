---
name: issue-resolution
description: GitHub Issueを解決し、作業単位で適切にコミットしながら進める
allowed-tools: Read, Write, Edit, Bash, Glob, Task, mcp__github__*
---

# Issue Resolution スキル

GitHub Issueの内容を読み取り、適切なブランチで解決を行うスキルです。

## 使用方法

`/resolve-issue`コマンドから呼び出され、以下の処理を行います：

1. Issue情報の取得と解析
2. ブランチ作成とセットアップ
3. 作業単位での解決とコミット
4. テスト実行と完了処理

## 解決プロセス

### ステップ1: Issue解析

```javascript
// Issue情報取得
mcp__github__issue_read({
  "method": "get",
  "owner": "[owner]",
  "repo": "[repo]",
  "issue_number": [番号]
})

// コメントも取得（追加要件がある場合）
mcp__github__issue_read({
  "method": "get_comments",
  ...
})
```

Issueの種類を判定：
- **bug**: 修正とテスト追加
- **enhancement**: 新機能の追加
- **refactor**: コード改善

### ステップ2: ブランチ作成

```bash
# ブランチ名の生成
# タイトルから簡潔な説明を抽出
git checkout -b issue-[番号]-[簡潔な説明]

# 例:
# Issue: "Login fails with special characters"
# Branch: "issue-123-fix-login-special-chars"
```

### ステップ3: ステアリング作成

`.steering/[日付]-issue-[番号]/`に3つのファイルを作成：

**requirements.md**: Issueの内容をそのまま保存
**design.md**: 解決アプローチを記載
**tasklist.md**: 詳細なタスクリストを作成

### ステップ4: 作業単位での解決

**重要: 各タスクごとに即座にコミット**

```bash
# タスク1: バリデーション関数追加
[作業実行]
git add src/validators/login.js
git commit -m "feat: ログイン用の特殊文字バリデーション関数を追加"

# タスク2: エラーメッセージ定数
[作業実行]
git add src/constants/errors.js
git commit -m "feat: ログインバリデーション用のエラーメッセージ定義"

# タスク3: サービス層の更新
[作業実行]
git add src/services/auth.js
git commit -m "fix: 認証サービスのバリデーションエラー処理を修正"

# タスク4: テスト追加
[作業実行]
git add tests/login.test.js
git commit -m "test: 特殊文字を含むログインのテストを追加"

# タスク5: コンポーネント更新
[作業実行]
git add src/components/LoginForm.jsx
git commit -m "fix: ログインフォームにバリデーション処理を適用"
```

### ステップ5: 品質チェック

各コミット後に軽量チェック：
```bash
npm run lint [変更ファイル]  # 該当ファイルのみ
```

全タスク完了後に完全チェック：
```bash
npm test
npm run lint
npm run typecheck
```

## コミット戦略

### 作業単位の定義

**良いコミット単位**:
- 1つの関数の追加
- 1つのコンポーネントの修正
- 1つのテストケースの追加
- 定数やタイプ定義の追加
- インポート文の整理

**避けるべき**:
- 複数機能をまとめた大きなコミット
- 「WIP」や「temporary」のようなコミット
- 動作しない中途半端な状態でのコミット

### コミットメッセージ規則

```
[prefix]: [日本語での説明]

プレフィックス:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: コードスタイル（フォーマット等）
- refactor: リファクタリング
- test: テスト追加・修正
- chore: ビルド・補助ツール

例:
feat: ログインバリデーション機能を追加
fix: ユーザーサービスのnullポインタエラーを修正
refactor: 認証モジュールのエラー処理を改善
test: ユーザー登録のユニットテストを追加
docs: APIドキュメントを更新
```

## Issueとの連携

### PR作成時の本文

```markdown
Closes #[Issue番号]

## 解決内容
[Issueの要件に対する解決サマリー]

## 変更点
- [主要な変更1]
- [主要な変更2]

## テスト
- [追加/更新したテスト]
- テスト結果: ✅

## コミット履歴
[作業単位での細かいコミット一覧]
```

## エラーハンドリング

### Issue取得エラー
```
❌ Issue #[番号]が見つかりません
GitHub権限を確認してください
```

### ブランチ作成エラー
```
⚠️ 既存のブランチがあります
別名でブランチを作成するか、既存を使用しますか？
```

### テスト失敗
```
❌ テストが失敗しました
失敗したテスト: [テスト名]
修正してから続行してください
```

## ベストプラクティス

1. **頻繁なコミット**
   - 1タスク1コミット
   - 後から履歴を追いやすく

2. **意味のある単位**
   - 論理的にまとまった変更
   - revertしやすい単位

3. **テスト駆動**
   - bugの場合は先にテストを書く
   - テストが通ることを確認

4. **段階的な解決**
   - 小さく始めて徐々に拡張
   - 各段階で動作確認