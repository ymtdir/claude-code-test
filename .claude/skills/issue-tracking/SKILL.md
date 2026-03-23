---
name: issue-tracking
description: 開発中に発見した課題をGitHub Issueとして作成する。「Issue作成」「create issue」と言われた時、またはバグ・機能追加・リファクタリングの必要性が発見された時に使用。bug/enhancement/refactorに分類しラベルを適用。
allowed-tools: Read, Write, Bash, Glob, mcp__github__*
---

# Issue Tracking スキル

開発中に発見した課題をGitHub Issueとして記録するスキルです。

## 使用方法

`/create-issue`コマンドから呼び出され、以下の処理を行います：

1. 課題の種類を判定（bug/enhancement/refactor）
2. 適切なテンプレートを選択
3. コンテキスト情報を収集
4. GitHub Issueを作成

## Issue作成プロセス

**注**: ラベル判定ルールは[shared/label-definitions.md](../shared/references/label-definitions.md)を参照

### ステップ1: 課題の分析と分類

課題の内容からラベルを自動判定します。
判定ルールの詳細は [shared/label-definitions.md](../shared/references/label-definitions.md) を参照してください。

判定方法：
1. タイトルと本文からキーワードを検索
2. マッチしたキーワードに基づいてラベルを選択
3. 複数マッチした場合は優先順位（bug > enhancement > ui/ux > documentation > refactor）で決定

### ステップ2: コンテキスト情報の収集

```bash
# Git情報
git branch --show-current
git log -1 --oneline

# ステアリング情報（あれば）
Glob('.steering/*/requirements.md')
```

### ステップ3: テンプレートの適用

選択されたテンプレートを読み込み、情報を埋め込み：

- **bug** → `assets/templates/bug.md`
- **enhancement** → `assets/templates/enhancement.md`
- **documentation** → シンプルな説明形式
- **refactor** → `assets/templates/refactor.md`

### ステップ4: GitHub Issue作成

```javascript
mcp__github__issue_write({
  "method": "create",
  "owner": "[リポジトリオーナー]",
  "repo": "[リポジトリ名]",
  "title": "[課題タイトル]",
  "body": "[テンプレートで生成した本文]",
  "labels": ["[種類ラベル]"]  // GitHubの標準ラベルのみ使用
})
```

### ステップ5: 課題の記録

作成したIssueの情報を`.steering/[日付]-[作業名]/issues.md`に追記：

```markdown
### [課題タイトル]
- **Issue番号**: #[番号]
- **種類**: [bug/enhancement/refactor]
- **作成日時**: [日時]
- **URL**: [Issue URL]
```

## ラベリング

使用するラベルは [shared/label-definitions.md](../shared/references/label-definitions.md) で定義されています。

- **自動付与**: キーワードマッチに基づいて種類ラベル（bug, enhancement等）を付与
- **手動付与**: 必要に応じて補助ラベル（good first issue, help wanted等）を追加

## エラーハンドリング

### GitHub未設定の場合

```bash
# ローカルファイルとして保存
Write('.issues-pending/[日時]-[タイトル].md', [Issue内容])
```

### 認証エラーの場合

GitHub MCPサーバーの設定を確認するよう案内

## テンプレート

### bug.md
- 現象と再現手順
- 期待される動作と実際の動作
- 環境情報

### enhancement.md
- 概要と背景
- 期待される効果
- 実装方針（初期Issue作成時）

### refactor.md
- 現在の問題点
- 改善案
- 対象箇所
- 影響範囲

### documentation（テンプレートなし）
- シンプルな説明形式で作成

## トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| `mcp__github__issue_write`がエラー | GitHub MCP未設定または認証切れ | `gh auth status`で確認、再認証 |
| ラベルが付与されない | リポジトリにラベルが存在しない | GitHubリポジトリのLabels設定を確認 |
| テンプレートが見つからない | パスの不一致 | `assets/templates/`配下にファイルが存在するか確認 |
| Issue分類が不適切 | キーワードマッチの曖昧さ | ユーザーに種類を確認してから作成 |