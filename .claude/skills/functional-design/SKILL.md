---
name: functional-design
description: 機能設計書を作成する。「機能設計書を作成」「functional design」と言われた時、または/setup-projectのステップ2で使用。PRDが前提。docs/functional-design.mdに出力。
allowed-tools: Read, Write
---

# 機能設計書作成スキル

このスキルは、高品質な機能設計書を作成するための詳細ガイドです。

## 前提条件

機能設計書作成を開始する前に、以下を確認してください:

### docs/product-requirements.md が作成されている

**必須**: PRDが以下の場所に存在する必要があります:

**ファイルパス**: `docs/product-requirements.md`

機能設計書は、PRDで定義された要件を技術的に実現する方法を詳細化します。

## 既存ドキュメントの優先順位

詳細は `../shared/references/document-priority-pattern.md` を参照。

**対象ファイル**: `docs/functional-design.md`

## 出力先

作成した機能設計書は以下に保存してください:

```
docs/functional-design.md
```

## テンプレートの参照

機能設計書を作成する際は、次のテンプレートを使用してください: ./assets/template.md

## 詳細ガイド

さらに詳しい作成ガイドは次のファイルを参照してください: ./references/guide.md

## トラブルシューティング

- **PRDが存在しない**: 先に `docs/product-requirements.md` を作成してください。`/setup-project` のステップ1で作成できます。
- **テンプレートが見つからない**: `./assets/template.md` のパスを確認してください。
- **既存の機能設計書との競合**: `../shared/references/document-priority-pattern.md` の優先順位ルールに従ってください。