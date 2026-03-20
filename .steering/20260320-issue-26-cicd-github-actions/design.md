# 設計書

## アーキテクチャ概要

GitHub Actionsを使用したCI/CDパイプラインを構築する。現在のプロジェクト構成（React + Vite + Vitest）に合わせて、以下のワークフローを実装する。

```
┌─────────────────────────────────────────────────────┐
│                 GitHub Repository                    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Push / Pull Request                                 │
│         │                                            │
│         ├─────► Test Workflow                       │
│         │        ├─ npm ci                          │
│         │        ├─ npm run typecheck               │
│         │        ├─ npm run test:run                │
│         │        └─ Coverage Report                 │
│         │                                            │
│         ├─────► CI Workflow (既存強化)              │
│         │        ├─ npm run format:check            │
│         │        ├─ npm run lint                    │
│         │        ├─ npm run typecheck               │
│         │        └─ npm run build                   │
│         │                                            │
│         └─────► Security Workflow                   │
│                  └─ npm audit                       │
│                                                       │
│  Weekly Schedule                                     │
│         │                                            │
│         └─────► Dependabot                          │
│                  ├─ npm dependencies                │
│                  └─ GitHub Actions                  │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## ワークフロー設計

### 1. test.yml - テスト実行ワークフロー

**責務**:
- 自動テスト実行
- コードカバレッジ測定
- 複数Node.jsバージョンでのテスト

**実装の要点**:
- matrix strategyで複数バージョン対応（Node.js 20.x, 25.x）
- vitestでテスト実行
- カバレッジレポートをアーティファクトとして保存
- PRへのコメント投稿（オプション）

**トリガー**:
- push（main, develop ブランチ）
- pull_request（main, develop ブランチ）

### 2. ci.yml - CI統合ワークフロー（既存強化）

**責務**:
- コード品質チェック
- 型チェック
- ビルド確認

**実装の要点**:
- 既存のci.ymlを拡張
- 型チェック追加
- テスト実行も含める（test.ymlと統合するか検討）

**トリガー**:
- push（main ブランチ）
- pull_request（main ブランチ）

### 3. security.yml - セキュリティスキャンワークフロー

**責務**:
- 脆弱性チェック
- セキュリティレポート生成

**実装の要点**:
- npm auditの実行
- audit-levelの設定（moderate以上）
- 定期実行（週次）とPR時実行

**トリガー**:
- schedule（週次: 毎週月曜日）
- pull_request（main ブランチ）

### 4. dependabot.yml - 依存関係自動更新

**責務**:
- npm依存関係の自動更新
- GitHub Actions依存関係の自動更新

**実装の要点**:
- 週次スケジュール
- 最大PR数を設定（10個まで）
- セマンティックバージョニングに従う

## データフロー

### テストワークフロー実行フロー
```
1. コードチェックアウト
2. Node.jsセットアップ（matrix: 20.x, 25.x）
3. 依存関係インストール（npm ci）
4. 型チェック実行（npm run typecheck）
5. テスト実行（npm run test:run）
6. カバレッジレポート生成
7. アーティファクトアップロード
```

## エラーハンドリング戦略

### ワークフロー失敗時の対応

- **テスト失敗**: PRマージをブロック、失敗の詳細をログに記録
- **ビルド失敗**: PRマージをブロック、ビルドエラーを表示
- **セキュリティ問題**: Issueを自動作成（オプション）
- **依存関係更新失敗**: Dependabotが自動的にPRをクローズ

## テスト戦略

### ワークフロー自体のテスト
- ローカルでact（GitHub Actions local runner）を使用してテスト
- 小さなPRでワークフローを段階的にテスト

### テストカバレッジ
- 既存のVitest設定を活用
- カバレッジ閾値の設定（オプション）

## 依存ライブラリ

既存のpackage.jsonに記載されているツールを使用:

```json
{
  "devDependencies": {
    "vitest": "^4.0.18",
    "@vitest/coverage-v8": "^4.1.0"
  }
}
```

新規追加: なし（GitHub Actionsの標準機能のみ使用）

## ディレクトリ構造

```
.github/
├── workflows/
│   ├── ci.yml              # 既存（強化）
│   ├── test.yml            # 新規
│   └── security.yml        # 新規
└── dependabot.yml          # 新規
```

## 実装の順序

1. test.ymlワークフローの作成（テスト実行）
2. ci.ymlワークフローの強化（型チェック追加）
3. security.ymlワークフローの作成（セキュリティスキャン）
4. dependabot.ymlの作成（依存関係自動更新）
5. 各ワークフローのテストと調整

## セキュリティ考慮事項

- シークレット情報はGitHub Secretsを使用
- 依存関係のバージョンは固定せず、自動更新を許可
- audit-levelはmoderateに設定
- PRからのワークフロー実行は制限を考慮

## パフォーマンス考慮事項

- `npm ci`を使用してキャッシュを活用
- actions/setup-nodeのcache機能を使用
- 並列実行可能なジョブは並列化
- 不要なステップは省略

## 将来の拡張性

- E2Eテスト（Playwright）の追加
- デプロイ自動化
- パフォーマンステスト
- ビジュアルリグレッションテスト
- CodeCovやSonarCloudとの統合
