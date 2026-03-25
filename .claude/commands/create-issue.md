---
description: 課題をGitHub Issueとして作成。種類を分類しテンプレート適用後GitHubに投稿。
---

# 開発中の課題をIssue化

このコマンドは、開発作業中に発見した課題をGitHub Issueとして記録します。

## 実行方法

```bash
claude
> /create-issue "課題の説明"
```

## 手順

### ステップ1: 引数の解析

1. 課題の説明を取得
2. オプションを解析（--type, --priority など）

### ステップ2: issue-trackingスキルの実行

1. **issue-trackingスキル**をロード
2. ラベル判定は **shared/references/label-definitions.md** の定義に従う
3. スキルに課題内容とオプションを渡してIssue作成:
   - 現在のGitコンテキストを収集
   - 課題の種類を判定（bug/enhancement/refactor）
   - 適切なテンプレートを選択
   - Issue本文を生成
   - GitHub APIでIssue作成

### ステップ3: 結果の報告

作成されたIssueのURLと番号を表示:
```
✅ Issueを作成しました！

Issue #123: ログアウト時にセッションが残る
URL: https://github.com/owner/repo/issues/123
ラベル: bug

現在の作業を続けてください。
```

## 完了条件

- GitHub Issueが正常に作成されていること
- Issue URLが表示されていること

完了時のメッセージ:
```
「Issue #[番号]を作成しました。

タイトル: [課題タイトル]
種類: [bug/enhancement/refactor]
URL: [GitHub Issue URL]

現在の作業を続けてください。」
```