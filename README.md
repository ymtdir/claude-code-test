# Claude Code Test

[![CI](https://github.com/ymtdir/claude-code-test/actions/workflows/ci.yml/badge.svg)](https://github.com/ymtdir/claude-code-test/actions/workflows/ci.yml)
[![Test](https://github.com/ymtdir/claude-code-test/actions/workflows/test.yml/badge.svg)](https://github.com/ymtdir/claude-code-test/actions/workflows/test.yml)
[![Security Scan](https://github.com/ymtdir/claude-code-test/actions/workflows/security.yml/badge.svg)](https://github.com/ymtdir/claude-code-test/actions/workflows/security.yml)

Claude Code開発テスト用のリポジトリです。

## 概要

このプロジェクトは、Claude Codeを使用したスペック駆動開発のテストおよび検証用リポジトリです。

## 技術スタック

- Node.js v25.2.1
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.3.1
- ESLint + Prettier

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## スクリプト

### 開発

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド

### コード品質

- `npm run lint` - ESLintでコードチェック
- `npm run format` - Prettierでコードフォーマット
- `npm run format:check` - フォーマットのチェック
- `npm run typecheck` - TypeScript型チェック

### テスト

- `npm test` - テストをwatchモードで実行
- `npm run test:run` - テストを1回実行
- `npm run test:run -- --coverage` - カバレッジ付きでテスト実行

### CI/CD

- `npm run ci:check` - CI環境で実行される全チェック

## プロジェクト構造

```
.
├── .claude/          # Claude Code設定
├── .github/          # GitHub Actions設定
├── .steering/        # 作業単位のドキュメント
├── docs/             # 永続的ドキュメント
├── src/              # ソースコード
└── tests/            # テストファイル
```

## CI/CD

このプロジェクトでは、GitHub Actionsを使用した自動化されたCI/CDパイプラインを実装しています。

### ワークフロー

1. **CI** (`.github/workflows/ci.yml`)
   - トリガー: `main`, `develop` ブランチへのpush/PR
   - 実行内容: フォーマットチェック、リント、型チェック、テスト、ビルド

2. **Test** (`.github/workflows/test.yml`)
   - トリガー: `main`, `develop` ブランチへのpush/PR
   - 実行内容: 複数Node.jsバージョン（20.x, 25.x）でのテストとカバレッジ測定

3. **Security Scan** (`.github/workflows/security.yml`)
   - トリガー: 週次スケジュール（毎週月曜）、PR
   - 実行内容: npm auditによる脆弱性スキャン

4. **Dependabot** (`.github/dependabot.yml`)
   - npm依存関係とGitHub Actionsの週次自動更新

### ブランチ保護

`main`ブランチはブランチ保護が設定されており、以下が必須です：

- すべてのCIチェックが成功すること
- コードレビューの承認
- 最新のmainブランチとの同期

## ドキュメント

### 開発者向けドキュメント

- [CONTRIBUTING.md](./docs/CONTRIBUTING.md) - コントリビューションガイド
- [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - トラブルシューティングガイド
- [SECURITY.md](./docs/SECURITY.md) - セキュリティガイドライン
- [API Documentation](./docs/api/README.md) - TypeDoc自動生成APIドキュメント

### プロジェクトドキュメント

- [CLAUDE.md](./CLAUDE.md) - スペック駆動開発のガイド
- [product-requirements.md](./docs/product-requirements.md) - プロダクト要求定義書
- [functional-design.md](./docs/functional-design.md) - 機能設計書
- [architecture.md](./docs/architecture.md) - アーキテクチャ設計書
- [repository-structure.md](./docs/repository-structure.md) - リポジトリ構造定義書
- [development-guidelines.md](./docs/development-guidelines.md) - 開発ガイドライン
- [glossary.md](./docs/glossary.md) - 用語集

## 開発プロセス

詳細は[CLAUDE.md](./CLAUDE.md)を参照してください。
