---
description: GitHub Issueを解決し、作業単位で適切にコミットしながら実装
---

# Issueの解決

このコマンドは、GitHub Issueの内容を読み取り、ブランチ作成から解決まで自動で行います。

## 実行方法

```bash
claude
> /resolve-issue 123
```

## 手順

### ステップ1: Issue番号の解析

1. 引数からIssue番号を取得
2. GitHubリポジトリの設定を確認

### ステップ2: issue-resolutionスキルの実行

1. **issue-resolutionスキル**をロード
2. スキルにIssue番号を渡して解決プロセスを実行:
   - Issue情報の取得と解析
   - ブランチ作成とステアリング準備
   - 作業単位での解決とコミット
   - テスト実行と完了処理

**重要**: スキルが以下を自動実行:
- 適切なブランチ名の生成（`issue-[番号]-[簡潔な説明]`）
- ステアリングファイルの作成
- 作業単位での細かいコミット（feat:, fix:, test: など）
- 品質チェックとテスト

### ステップ3: 結果の報告

解決完了後の情報を表示:
```
✅ Issue #[番号]を解決しました！

ブランチ: issue-[番号]-[説明]
コミット数: [数]
テスト結果: ✅

次のステップ:
- PR作成: gh pr create
- Issue確認: [Issue URL]
```

## 完了条件

- Issueの要件を満たす実装が完了
- 作業単位でコミットが作成されている
- テストがパス
- Issueとの紐付けが明確

完了時のメッセージ:
```
「Issue #123を解決しました！

ブランチ: issue-123-fix-login-bug
コミット数: [数]
テスト: ✅ パス

次のステップ:
- PR作成: gh pr create
- Issue確認: https://github.com/[owner]/[repo]/issues/123」
```