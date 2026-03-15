---
name: repository-structure
description: リポジトリ構造定義書を作成する。「リポジトリ構造」「ディレクトリ構造」と言われた時、または/setup-projectのステップ4で使用。docs/repository-structure.mdに出力。
allowed-tools: Read, Write
---

# リポジトリ構造定義スキル

このスキルは、明確で保守しやすいリポジトリ構造を定義するための詳細ガイドです。

## 前提条件

リポジトリ構造定義を開始する前に、以下を確認してください:

### 必須ドキュメント

1. `docs/product-requirements.md` (PRD)
2. `docs/functional-design.md` (機能設計書)
3. `docs/architecture.md` (アーキテクチャ設計書)

リポジトリ構造は、アーキテクチャ設計で決定された技術スタックとシステム構成を反映した具体的なディレクトリ構造を定義します。

## 既存ドキュメントの優先順位

詳細は `../shared/references/document-priority-pattern.md` を参照。

**対象ファイル**: `docs/repository-structure.md`

## 出力先

作成したリポジトリ構造定義書は以下に保存してください:

```
docs/repository-structure.md
```

## テンプレートの参照

リポジトリ構造定義書を作成する際は、次のテンプレートを使用してください: ./assets/template.md

## 詳細ガイド

さらに詳しい作成ガイドは次のファイルを参照してください: ./references/guide.md

## トラブルシューティング

- **前提ドキュメントが不足**: PRD、機能設計書、アーキテクチャ設計書が必要です。不足している場合は先に作成してください。
- **テンプレートが見つからない**: `./assets/template.md` のパスを確認してください。
- **既存の定義書との競合**: `../shared/references/document-priority-pattern.md` の優先順位ルールに従ってください。