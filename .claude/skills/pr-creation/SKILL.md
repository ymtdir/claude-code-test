---
name: pr-creation
description: 現在のブランチの変更内容を分析し、適切なテンプレートでPull Requestを作成
allowed-tools: Read, Write, Bash, Glob, mcp__github__*
---

# Pull Request Creation スキル

現在のブランチの変更内容を分析し、GitHub Pull Requestを作成するスキルです。

## 使用方法

`/create-pr`コマンドから呼び出され、以下の処理を行います：

1. ブランチと変更内容の分析
2. 関連Issueの特定
3. 適切なテンプレートでPR作成
4. レビュー準備の完了

## PR作成プロセス

### ステップ1: ブランチ情報の収集

```bash
# 現在のブランチ
git branch --show-current

# ベースブランチとの差分
git diff --stat origin/main...HEAD

# コミット履歴
git log origin/main..HEAD --oneline

# 変更ファイル一覧
git diff --name-only origin/main...HEAD
```

### ステップ2: Issue番号の特定

ブランチ名から自動判定:
- `issue-123-fix-bug` → Issue #123
- `feature/user-auth` → コミットメッセージから検索
- その他 → 最近のコミットメッセージから`#\d+`を検索

### ステップ3: 変更内容の分類

コミットメッセージのプレフィックスから判定:
- **fix:** が多い → bug PR
- **feat:** が多い → feature PR
- **refactor:** が多い → refactor PR

### ステップ4: テンプレートの適用

判定された種類に応じてテンプレートを選択:
- **bug** → `templates/bug-fix.md`
- **feature** → `templates/feature.md`
- **refactor** → `templates/refactor.md`

### ステップ5: PR作成

```javascript
mcp__github__create_pull_request({
  "owner": "[owner]",
  "repo": "[repo]",
  "title": "[PRタイトル]",
  "body": "[テンプレートで生成した本文]",
  "head": "[現在のブランチ]",
  "base": "main",
  "draft": false
})
```

## PRタイトルの生成

### パターン1: Issue連携あり
```
fix: [Issue概要] (#123)
feat: [Issue概要] (#456)
refactor: [Issue概要] (#789)
```

### パターン2: Issue連携なし
```
fix: [最初のコミットメッセージから抽出]
feat: [主要な変更内容を要約]
refactor: [リファクタリング対象を明記]
```

## PR本文の構成

### 共通セクション

```markdown
## 概要
[変更内容の要約]

## 関連Issue
Closes #[Issue番号]（あれば）

## 変更内容
[主要な変更点を箇条書き]

## テスト
- [ ] ユニットテスト: [結果]
- [ ] 統合テスト: [結果]
- [ ] 手動テスト: [実施内容]

## スクリーンショット
[UIの変更があれば]

## レビューポイント
[特に確認してほしい箇所]
```

## コミット履歴の整理

PRに含まれるコミットを分析して整理:

```markdown
## コミット履歴
### 機能追加 (feat)
- ログイン機能を追加 (abc123)
- バリデーション処理を実装 (def456)

### バグ修正 (fix)
- セッション保存エラーを修正 (ghi789)

### テスト (test)
- ログインのE2Eテストを追加 (jkl012)
```

## 自動チェック

PR作成前の確認:
1. **未コミットの変更がないか**
   ```bash
   git status --short
   ```

2. **リモートとの同期**
   ```bash
   git fetch origin
   git status -sb
   ```

3. **テストの実行**
   ```bash
   npm test
   npm run lint
   ```

## エラーハンドリング

### ブランチがmainの場合
```
❌ mainブランチから直接PRは作成できません
新しいブランチを作成してください
```

### 変更がない場合
```
⚠️ ベースブランチとの差分がありません
変更をコミットしてから実行してください
```

### コンフリクトがある場合
```
⚠️ マージコンフリクトが検出されました
以下のファイルで競合しています:
- [ファイルリスト]

解決してから再度実行してください
```

## レビュー準備

PR作成後の追加処理:

1. **ラベルの付与**
   - 種類に応じたラベル（bug/enhancement/refactor）
   - 優先度ラベル（必要に応じて）

2. **レビュアーの推奨**
   - 変更ファイルのCODEOWNERSから自動判定
   - 最近のコントリビューターから提案

3. **関連PRの確認**
   - 同じIssueに関連する他のPR
   - 競合する可能性のあるPR