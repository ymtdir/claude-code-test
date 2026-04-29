# ミニマル家計簿（プロトタイプ）

iOS 向けミニマル家計簿アプリの **検証用プロトタイプ**。本格実装は別リポジトリで作り直す前提。

## 現状

設計ドキュメント完成、Xcode プロジェクト未作成。次は `MinimalKakebo.xcodeproj` を Xcode で新規作成する段階。

## 絶対方針（変更厳禁・詳細は各ドキュメント）

- **アーキテクチャ**: MV パターン（MVVM ではない）。ViewModel クラスは作らない
- **技術**: Swift 5.9+ / SwiftUI / SwiftData（iOS 17+）。サードパーティ禁止
- **金額型**: `Int`（円、JPY 専用）。`Decimal` は使わない
- **完全手動入力**: 自動取り込み・自動計上は実装しない

## ドキュメント

| 用途             | パス                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| 要件             | [docs/requirements.md](docs/requirements.md)                                         |
| 基本設計         | [docs/basic-design.md](docs/basic-design.md)                                         |
| 詳細設計         | [docs/detailed-design.md](docs/detailed-design.md)                                   |
| デザイン仕様     | [DESIGN.md](DESIGN.md)                                                               |
| ワイヤーフレーム | [docs/mockups/家計簿ワイヤーフレーム.html](docs/mockups/家計簿ワイヤーフレーム.html) |
| 開発ガイド       | [docs/development-guide.md](docs/development-guide.md)                               |

## プロジェクト規約

- コミット規約: [.claude/rules/commit-conventions.md](.claude/rules/commit-conventions.md)
- ラベル定義: [.claude/rules/label-definitions.md](.claude/rules/label-definitions.md)
- ドキュメント生成ガイド: [.claude/rules/document-generation-guide.md](.claude/rules/document-generation-guide.md)
