---
name: glossary-creation
description: プロジェクト用語集を作成する。「用語集」「glossary」と言われた時、または/setup-projectのステップ6で使用。docs/glossary.mdに出力。
allowed-tools: Read, Write
---

# 用語集作成スキル

このスキルは、プロジェクト固有の用語と技術用語を体系的に定義するための詳細ガイドです。

## 前提条件

用語集作成を開始する前に、以下を確認してください:

### 推奨ドキュメント

1. **docs/product-requirements.md** (PRD)
2. **docs/functional-design.md** (機能設計書)
3. **docs/architecture.md** (アーキテクチャ設計書)
4. **docs/repository-structure.md** (リポジトリ構造)
5. **docs/development-guidelines.md** (開発ガイドライン)

用語集は、全てのドキュメントで使用される用語を統一的に定義します。
各ドキュメントから用語を抽出し、体系的に整理してください。

## 既存ドキュメントの優先順位

詳細は `../shared/references/document-priority-pattern.md` を参照。

**対象ファイル**: `docs/glossary.md`

## 出力先

作成した用語集は以下に保存してください:

```
docs/glossary.md
```

## テンプレートの参照

用語集を作成する際は、次のテンプレートを使用してください: ./assets/template.md

## 詳細ガイド

さらに詳しい作成ガイドは次のファイルを参照してください: ./references/guide.md

## トラブルシューティング

- **推奨ドキュメントが不足**: 他のドキュメントがなくても用語集は作成可能ですが、用語の抽出元として事前作成を推奨します。
- **テンプレートが見つからない**: `./assets/template.md` のパスを確認してください。
- **既存の用語集との競合**: `../shared/references/document-priority-pattern.md` の優先順位ルールに従ってください。