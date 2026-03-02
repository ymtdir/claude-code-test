# Claude Code Test

[![CI](https://github.com/ymtdir/claude-code-test/actions/workflows/ci.yml/badge.svg)](https://github.com/ymtdir/claude-code-test/actions/workflows/ci.yml)

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

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド
- `npm run lint` - ESLintでコードチェック
- `npm run format` - Prettierでコードフォーマット
- `npm run format:check` - フォーマットのチェック

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

## 開発プロセス

詳細は[CLAUDE.md](./CLAUDE.md)を参照してください。
