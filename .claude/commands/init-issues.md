---
description: /setup-project完了後に初期開発Issue群を一括作成。プロジェクトドキュメントを分析し依存関係付きIssueセットを生成。
---

# 初期Issue一括作成

プロジェクトの開発を開始するための基本的なIssueセットを作成します。

## 実行方法

```bash
claude
> /init-issues
```

## 前提条件
- `/setup-project`が完了していること
- 以下のドキュメントが存在すること：
  - docs/product-requirements.md
  - docs/functional-design.md
  - docs/architecture.md

## 手順

### ステップ1: プロジェクト分析

1. ドキュメントを読み込み、プロジェクトタイプを判定
   - モバイルアプリ（React Native/Flutter）
   - Webアプリ（React/Next.js/Vue）
   - CLIツール
   - APIサーバー

2. 技術スタックを確認
3. 主要機能を抽出

### ステップ2: Issue作成計画

プロジェクトタイプに応じた標準Issueセットを設計：

**共通Issue**:
- 開発環境セットアップ
- 基本プロジェクト構造
- データモデル実装

**プロジェクト固有Issue**:
- モバイル: オフライン対応、プッシュ通知
- Web: レスポンシブ対応、SEO
- CLI: コマンド実装、設定管理

各Issueについて以下を決定：
- タイトルと本文
- 種類（bug/enhancement/refactor/documentation）
- 依存関係（前のステップへの依存を明記）

### ステップ3: issue-trackingスキルで各Issueを作成

**issue-trackingスキル**をロードし、計画した各Issueを順番に作成します。

各Issueの作成フロー（issue-trackingスキルに委譲）：
1. 種類に応じたラベル判定（label-definitions.md準拠）
2. テンプレート適用
3. 依存関係を本文に記述（例: `前提: #15`）
4. GitHub APIでIssue作成

**重要**: ラベル判定・テンプレート適用のロジックはissue-trackingスキルに一元化されているため、このコマンドでは独自にラベルを決定しない。

### ステップ4: 結果レポート

```
✅ 初期Issue作成完了！

作成されたIssue:
#7 【Step 1】開発環境セットアップ (enhancement)
#8 【Step 2】基本プロジェクト構造 (enhancement)
#9 【Step 3】データモデル実装 (enhancement)
#10 【Step 4】テスト環境構築 (enhancement)
#11 【Step 5】ドキュメント整備 (documentation)
...

次のステップ:
/resolve-issue 7  # 開発を開始
```

## 完了条件

- 論理的な順序でIssueが作成される
- 依存関係が明確に記載される
- 開発着手可能な状態になる
