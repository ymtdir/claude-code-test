---
name: development-guidelines
description: 開発ガイドライン（コーディング規約・開発プロセス）を作成する。「開発ガイドライン」「コーディング規約」と言われた時、コード実装時の規約確認、または/setup-projectのステップ5で使用。docs/development-guidelines.mdに出力。
allowed-tools: Read, Write, Edit
---

# 開発ガイドラインスキル

チーム開発に必要な2つの要素をカバーします:
1. 実装時のコーディング規約 (implementation-guide.md)
2. 開発プロセスの標準化 (process-guide.md)

## 前提条件

開発ガイドライン作成を開始する前に、以下を確認してください:

### 推奨ドキュメント

1. `docs/architecture.md` (アーキテクチャ設計書) - 技術スタックの確認
2. `docs/repository-structure.md` (リポジトリ構造) - ディレクトリ構造の確認

開発ガイドラインは、プロジェクトの技術スタックとディレクトリ構造に
基づいた具体的なコーディング規約と開発プロセスを定義します。

## 既存ドキュメントの優先順位

詳細は `../shared/references/document-priority-pattern.md` を参照。

**対象ファイル**: `docs/development-guidelines.md`

## 出力先

作成した開発ガイドラインは以下に保存してください:

```
docs/development-guidelines.md
```

## クイックリファレンス

### コード実装時
コード実装時のルールと規約: ./references/implementation-guide.md

含まれる内容:
- TypeScript/JavaScript規約
- 型定義・命名規則
- 関数設計とエラーハンドリング
- コメント規約
- セキュリティとパフォーマンス
- テストコード実装
- リファクタリング手法

### 開発プロセスの参照／策定時
Git運用、テスト戦略、コードレビュー: ./references/process-guide.md

含まれる内容:
- 基本原則（具体例の重要性、理由説明）
- Git運用ルール（Git Flow ブランチ戦略）
- コミットメッセージとPRプロセス
- テスト戦略（ピラミッドとカバレッジ）
- コードレビューのプロセス
- 品質自動化

### テンプレート
開発ガイドライン作成時: ./assets/template.md


## 使用シーン別ガイド

### 新規開発時
1. ./references/implementation-guide.md で命名規則・コーディング規約を確認
2. ./references/process-guide.md でブランチ戦略・PR処理を確認
3. テストを先に書く（TDD）

### コードレビュー時
- ./references/process-guide.md の「コードレビュープロセス」を参照
- ./references/implementation-guide.md で規約違反がないか確認

### テスト設計時
- ./references/process-guide.md の「テスト戦略」（ピラミッド、カバレッジ）
- ./references/implementation-guide.md の「テストコード」（実装パターン）

### リリース準備時
- ./references/process-guide.md の「Git運用ルール」（main へのマージ方針）
- コミットメッセージが Conventional Commits に従っているか確認

## チェックリスト

- [ ] コーディング規約が具体例付きで定義されている
- [ ] 命名規則が明確である（言語別・プロジェクト固有）
- [ ] エラーハンドリングの方針が定義されている
- [ ] ブランチ戦略が決まっている（Git Flow推奨）
- [ ] コミットメッセージ規約が明確である
- [ ] PRテンプレートが用意されている
- [ ] テストの種類とカバレッジ目標が設定されている
- [ ] コードレビュープロセスが定義されている
- [ ] CI/CDパイプラインが構築されている

## トラブルシューティング

- **推奨ドキュメントが不足**: `docs/architecture.md` と `docs/repository-structure.md` がなくても作成可能ですが、技術スタックに合った規約にするため事前作成を推奨します。
- **テンプレートが見つからない**: `./assets/template.md` のパスを確認してください。
- **ガイドファイルが見つからない**: `./references/implementation-guide.md` および `./references/process-guide.md` のパスを確認してください。
- **既存のガイドラインとの競合**: `../shared/references/document-priority-pattern.md` の優先順位ルールに従ってください。