---
name: architecture-design
description: アーキテクチャ設計書を作成する。「アーキテクチャ設計」「技術仕様書」と言われた時、または/setup-projectのステップ3で使用。PRDと機能設計書が前提。docs/architecture.mdに出力。
allowed-tools: Read, Write
---

# アーキテクチャ設計スキル

このスキルは、高品質なアーキテクチャ設計書を作成するための詳細ガイドです。

## 前提条件

アーキテクチャ設計を開始する前に、以下を確認してください:

### 必須ドキュメント

1. `docs/product-requirements.md` (PRD)
2. `docs/functional-design.md` (機能設計書)

アーキテクチャ設計は、PRDの要件と機能設計を技術的に実現するための
システム構造とテクノロジースタックを定義します。

## 既存ドキュメントの優先順位

詳細は `../shared/references/document-priority-pattern.md` を参照。

**対象ファイル**: `docs/architecture.md`

## 出力先

作成したアーキテクチャ設計書は以下に保存してください:

```
docs/architecture.md
```

## テンプレートの参照

アーキテクチャ設計書を作成する際は、次のガイドを参照しながら、テンプレートを使用してください:
- ガイド: ./references/guide.md
- テンプレート: ./assets/template.md

## トラブルシューティング

- **前提ドキュメントが不足**: `docs/product-requirements.md` と `docs/functional-design.md` の両方が必要です。不足している場合は先に作成してください。
- **テンプレートが見つからない**: `./assets/template.md` のパスを確認してください。
- **既存の設計書との競合**: `../shared/references/document-priority-pattern.md` の優先順位ルールに従ってください。