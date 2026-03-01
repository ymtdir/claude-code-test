---
name: issue-tracking
description: 開発中に発見した課題を適切なテンプレートを使用してGitHub Issueとして作成する
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

### ステップ1: 課題の分析と分類

課題の内容から種類を自動判定：

- **bug**: エラー、不具合、期待と異なる動作
  - キーワード: error, bug, broken, fail, crash, 動作しない
- **enhancement**: 新機能、改善提案
  - キーワード: 追加, 改善, 機能, enhancement, feature
- **refactor**: リファクタリング、技術的負債
  - キーワード: リファクタ, 整理, 技術的負債, TODO, FIXME

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

- **bug** → `templates/bug.md`
- **enhancement** → `templates/enhancement.md`
- **refactor** → `templates/refactor.md`

### ステップ4: GitHub Issue作成

```javascript
mcp__github__issue_write({
  "method": "create",
  "owner": "[リポジトリオーナー]",
  "repo": "[リポジトリ名]",
  "title": "[課題タイトル]",
  "body": "[テンプレートで生成した本文]",
  "labels": ["deferred", "[種類ラベル]"]
})
```

### ステップ5: 課題の記録

作成したIssueの情報を`.steering/[日付]-[作業名]/issues.md`に追記：

```markdown
### [課題タイトル]
- **Issue番号**: #[番号]
- **種類**: [bug/enhancement/tech-debt]
- **作成日時**: [日時]
- **URL**: [Issue URL]
```

## ラベリング

自動付与されるラベル：

- **deferred**: 後日対応（デフォルト）
- **bug**: バグ・不具合
- **enhancement**: 機能追加・改善
- **refactor**: リファクタリング・技術的負債
- **priority-high**: 優先度高（オプション）
- **priority-medium**: 優先度中（オプション）
- **priority-low**: 優先度低（オプション）

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

### enhancement.md
- 提案内容と背景
- 期待される効果

### refactor.md
- 現在の問題点
- 改善案
- 対象箇所
- 作業規模