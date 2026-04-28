# 開発ガイドライン

本プロジェクト「ミニマル家計簿」の開発における、リポジトリ構造・コーディング規約・Git 運用・テスト戦略・用語集を定める。

## プロジェクトの位置づけ

本リポジトリは **検証用プロトタイプ** として位置づける。

- 目的: Swift / SwiftUI / SwiftData の習得と、設計（MV パターン / ミニマル思想 / 完全手動入力）を実機で検証すること
- **将来的に本格実装する際は、本リポジトリを破棄し別リポジトリで作り直す前提**
- そのため本ガイドラインの品質ゲートは「学習・検証に支障がない最低限」に留め、CI/CD・厳格なテストカバレッジ・大規模チーム向けプロセス等は **意図的に除外** する
- ただし、本格実装時に再利用したい知見（要件定義 / 基本設計 / 詳細設計の判断 / 用語集）はドキュメント側に残す

## リポジトリ構造

### プロジェクト構造

Xcode プロジェクトを基準に、MV パターン（基本設計書 / 詳細設計書）に従ったディレクトリ構成とする。

```
project-root/
├── MinimalKakebo.xcodeproj/         # Xcode プロジェクト
├── MinimalKakebo/                   # アプリソース
│   ├── App/                         # アプリのエントリポイント
│   │   └── MinimalKakeboApp.swift   # @main、ModelContainer 初期化
│   ├── Views/                       # SwiftUI View（画面別サブディレクトリ）
│   │   ├── Root/                    # RootTabView
│   │   ├── Entry/                   # 入力タブ + 入力シート
│   │   ├── Calendar/                # カレンダー画面
│   │   ├── Report/                  # レポート画面
│   │   ├── Budget/                  # 予算画面
│   │   ├── Settings/                # 設定 / カテゴリ管理 / 固定費
│   │   └── Components/              # 共通 UI 部品（SummaryHeader 等）
│   ├── Models/                      # @Model エンティティ + 関連型
│   │   ├── Transaction.swift
│   │   ├── Category.swift
│   │   ├── Budget.swift
│   │   ├── FixedExpense.swift
│   │   └── ValueTypes.swift         # MonthlySummary / BudgetStatus 等の値型
│   ├── Logic/                       # 純粋ロジック struct（副作用なし）
│   │   ├── SummaryAggregator.swift
│   │   ├── BudgetCalculator.swift
│   │   ├── Validator.swift
│   │   ├── DateRange.swift
│   │   ├── CurrencyFormatter.swift
│   │   └── CategoryDeletionGuard.swift
│   ├── Errors/                      # エラー型
│   │   ├── ValidationError.swift
│   │   └── DataIntegrityError.swift
│   ├── Resources/                   # アセット・初期データ
│   │   ├── Assets.xcassets/
│   │   └── DefaultCategories.swift  # 初期カテゴリ定義
│   └── Supporting/                  # Info.plist など
├── MinimalKakeboTests/              # ユニットテスト
│   ├── Logic/                       # 純粋ロジックのテスト（主戦場）
│   └── Models/                      # SwiftData 統合テスト（in-memory）
├── MinimalKakeboUITests/            # UI テスト（任意・最小限）
├── .swiftformat                     # SwiftFormat 設定
├── .swiftlint.yml                   # SwiftLint 設定（任意導入）
├── .gitignore
├── README.md
└── docs/                            # プロジェクトドキュメント
```

### ディレクトリの責務

| ディレクトリ          | 責務                                            | 配置するファイル                         | 配置しないもの             |
| --------------------- | ----------------------------------------------- | ---------------------------------------- | -------------------------- |
| `App/`                | アプリ起動、ModelContainer 構築、初期データ投入 | `@main App` 構造体、起動時セットアップ   | View 本体、ロジック        |
| `Views/`              | SwiftUI による画面定義                          | `View` 準拠の struct                     | 永続化以外の複雑なロジック |
| `Models/`             | SwiftData の `@Model` クラスと値型              | `@Model class`、`struct` 値型、`enum`    | 描画 / View ロジック       |
| `Logic/`              | 副作用のない純粋関数（集計・検証・整形）        | `enum` namespace に `static func` を集約 | SwiftData / SwiftUI 依存   |
| `Errors/`             | アプリ固有エラー型                              | `Error` 準拠 `enum`                      | 業務ロジック               |
| `Resources/`          | アセット・初期固定データ                        | 画像・色・初期カテゴリ定義               | 動的データ                 |
| `MinimalKakeboTests/` | 自動テスト                                      | Swift Testing / XCTest ファイル          | 本番コード                 |

### 命名規則

#### ディレクトリ名

- アプリソース直下は **PascalCase**（例: `Views/`, `Models/`）。Apple のサンプルコード慣例に合わせる
- View のサブディレクトリも PascalCase（例: `Calendar/`, `Settings/`）

#### ファイル名

- Swift ファイルは **PascalCase + 内容の主要型名**（例: `CalendarView.swift`, `Transaction.swift`）
- 1 ファイル 1 主要型を原則とする（小さな関連型は同じファイル内で OK）
- テストファイルは **対象 + `Tests`**（例: `SummaryAggregatorTests.swift`）

#### 型・関数命名（Swift API Design Guidelines 準拠）

- 型名: `PascalCase`（`CalendarView`, `MonthlySummary`）
- 変数・関数・プロパティ: `lowerCamelCase`（`monthTransactions`, `loadMonth`）
- enum case: `lowerCamelCase`（`.income`, `.expense`）
- 定数: 通常の `lowerCamelCase`（Swift では `UPPER_SNAKE_CASE` を使わない）
- Boolean: `is` / `has` / `should` / `can` で始める（`isOverBudget`, `hasMemo`）

---

## コーディング規約

### 言語・フレームワーク

- **Swift 5.9+** を使用。最新の Swift 言語機能（`#Predicate`, `@Observable`, `Result builders`）を活用
- Apple 公式の **Swift API Design Guidelines** に従う（<https://www.swift.org/documentation/api-design-guidelines/>）
- **MV パターン（基本設計書参照）** を厳守。ViewModel クラスは作らない

### フォーマッタ・リンタ

| ツール                                           | 用途                   | 設定ファイル                          | プロトタイプでの扱い   |
| ------------------------------------------------ | ---------------------- | ------------------------------------- | ---------------------- |
| `swift-format`（Apple 公式）または `SwiftFormat` | 自動整形               | `.swift-format` または `.swiftformat` | 任意（手動整形でも可） |
| SwiftLint                                        | 静的解析・規約チェック | `.swiftlint.yml`                      | 不要                   |

プロトタイプ段階のため、フォーマッタ / リンタの強制適用は行わない。Xcode のデフォルト整形（⌃I）で十分とする。

### コメント規約

「**書かないことを基本**」とする。コードの意図はコード自体で表現する。コメントを書くのは以下のケースに限定:

- ビジネスルール上の **非自明な制約**（例: 「カテゴリ削除は Transaction / Budget / FixedExpense の参照を全件確認後」）
- **意図的な選択** で他の選択肢を排除した理由（例: 「JPY 専用前提のため `Decimal` ではなく `Int` を使用」）
- `// TODO:` / `// FIXME:` + Issue 番号（残作業・既知問題のトラッキング）

書かないコメント:

- コードの内容を日本語で繰り返すだけのもの
- 「変数 i を 1 増やす」のような自明な説明
- コメントアウトされた死んだコード（消す）

### エラーハンドリング

- `ValidationError` / `DataIntegrityError` を使い分ける（詳細設計書「Error 型階層」参照）
- 関数で失敗が起こり得る場合は `throws` または `Result<T, Error>` を返す
- View では `try` の戻りをアラート / フィールド下表示に変換する
- SwiftData の `try modelContext.save()` の失敗は `os.Logger` でログ出力後、汎用アラート

### 入力検証

すべての入力は `Logic/Validator.swift` の純粋関数で検証する。View 内で if 文を散らさない。

```swift
// 良い例
switch Validator.validate(amount: input) {
case .success(let value): // value: Int
case .failure(let error): // error: ValidationError
}
```

### 機密情報

本アプリは API キー・シークレットを保持しない。万が一今後追加する場合も **絶対にハードコードせず**、Keychain または `xcconfig` + `.gitignore` で管理する。

### パフォーマンス

- SwiftData の `@Query` には必ず `#Predicate` で範囲フィルタを掛ける（全件取得を避ける）
- 月境界・日境界の計算は `DateRange` 経由で統一（個別計算による不整合を防ぐ）
- 純粋関数の集計は `O(n)` を原則とする（複数パス・ネストループを避ける）

---

## Git 運用ルール

### ブランチ戦略

プロトタイプかつ単独開発のため、最小構成とする:

```
main             # 動作する最新コード
└── feature/*    # 大きめの新機能・実験（任意）
└── fix/*        # バグ修正（任意）
```

- `main` への直接コミットを **許容**（個人プロトタイプかつ非公開のため）
- 大きな機能や実験的変更で履歴を分けたい場合のみ `feature/*` を切る
- PR レビュー必須化はしない（セルフレビューで十分）

### コミットメッセージ規約

詳細は [.claude/rules/commit-conventions.md](../.claude/rules/commit-conventions.md) を参照。

- フォーマット: `[prefix]: [日本語の説明]`
- prefix: `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore`
- プロトタイプでも 1 コミット 1 目的は守る（後で振り返るため）

### Pull Request（任意）

PR を出す場合のみ:

- ラベル付与は [.claude/rules/label-definitions.md](../.claude/rules/label-definitions.md) に従う
- 厳格なレビュープロセスは不要（セルフレビューと差分確認のみ）

---

## テスト戦略

### テストの種類と配置

| 種別                           | 配置                         | 命名                             | 主な対象                                                                                                        |
| ------------------------------ | ---------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ユニットテスト（純粋ロジック） | `MinimalKakeboTests/Logic/`  | `<対象型>Tests.swift`            | `SummaryAggregator`, `BudgetCalculator`, `Validator`, `DateRange`, `CurrencyFormatter`, `CategoryDeletionGuard` |
| 統合テスト（SwiftData 連携）   | `MinimalKakeboTests/Models/` | `<対象型>IntegrationTests.swift` | `@Model` の保存 / フェッチ、`@Relationship` の削除制約、`#Predicate` クエリ                                     |
| UI テスト                      | `MinimalKakeboUITests/`      | `<画面>UITests.swift`            | （任意・最小限。タブ切替や入力フローの正常系のみ）                                                              |

### テスト方針（プロトタイプ向け）

- 検証用プロトタイプのため、テストは **「壊したくないコア純粋ロジックのみ」** に絞る
- `Validator` と `BudgetCalculator` のように **手で確認しづらい計算系** は最低限テストを書く
- View / SwiftData 連携は **手動動作確認（実機 / シミュレータ）で代替** し、自動テストは書かない
- Given-When-Then パターンで記述する
- Swift Testing が使える環境では Swift Testing を優先、それ以外は XCTest

```swift
// 例: SummaryAggregator のテスト
@Test func 月内の収支を集計できる() {
    // Given
    let transactions: [Transaction] = [...]
    // When
    let summary = SummaryAggregator.summarize(transactions)
    // Then
    #expect(summary.totalIncome == 30_000)
    #expect(summary.totalExpense == 20_000)
}
```

### カバレッジ目標

数値目標は設けない。プロトタイプでは「**気になるところだけテストを書く**」スタンスで十分。本格実装時に改めてカバレッジ戦略を策定する。

---

## ローカル開発手順

### 初回セットアップ

1. macOS 上に最新の Xcode をインストール（App Store または Apple Developer サイト）
2. リポジトリを clone
3. `MinimalKakebo.xcodeproj` を Xcode で開く
4. ターゲットデバイス（シミュレータ）を選び ⌘R で実行

### 実機デプロイ

1. Apple ID（無料 Personal Team で可）を Xcode に登録
2. ターゲットの Signing & Capabilities で Team を設定
3. iPhone を Mac に接続し、信頼設定を行う
4. ターゲットデバイスを実機に切り替え ⌘R で実行
5. 初回は iPhone の「設定 > 一般 > VPN とデバイス管理」で開発者を信頼する

### セルフチェック項目（プロトタイプでも気にすべき最低限）

学習効果と本格実装時の再利用性を確保するため、以下だけは意識する:

- [ ] MV パターンを逸脱していないか（不要な ViewModel クラスを作っていないか）
- [ ] View 内に複雑なロジックを直書きしていないか（純粋 struct に切り出されているか）
- [ ] `@Query` に `#Predicate` で範囲フィルタが付いているか
- [ ] 入力検証が `Validator` 経由で行われているか
- [ ] 命名が Swift API Design Guidelines に従っているか

---

## 用語集

### ドメイン用語

#### Transaction（収支レコード）

**定義**: 1 件の収入または支出。

**フィールド**: 金額（`Int`、円）、種別（`income` / `expense`）、日付、カテゴリ、メモ。

**使用例**: 「カレンダー画面に表示される各日の Transaction 一覧」

#### Category（カテゴリ）

**定義**: Transaction / Budget / FixedExpense を分類するための軸（食費・交通費 等）。

**制約**: 名称は一意。使用中（参照中）のカテゴリは削除不可。

#### Budget（予算）

**定義**: 月単位の予算。全体予算（`category == nil`）またはカテゴリ別予算。同一スコープに 1 件まで。

#### FixedExpense（固定費）

**定義**: 家賃・サブスクなどの定期支出をユーザーが手動管理するための参照リスト。

**重要**: Transaction を **自動生成しない**（要件定義書「完全手動入力」コンセプトに従う）。

#### MonthlySummary

**定義**: 1 ヶ月分の Transaction 集計結果。`totalIncome` / `totalExpense` / `byCategory` を保持する値型。

#### BudgetConsumption / BudgetStatus

**定義**: 予算の消化状況。`budgetAmount` / `spentAmount` / `remainingAmount`（負値で超過）/ `consumptionRate`（1.0 超で超過）を保持。

### 技術用語

#### Swift

**定義**: Apple が開発するプログラミング言語。

**バージョン**: 5.9 以上。

#### SwiftUI

**定義**: Apple 公式の宣言的 UI フレームワーク（2019 年発表）。

**用途**: 全画面の View 定義。

#### SwiftData

**定義**: Apple 公式の永続化フレームワーク（2023 年発表、Core Data の後継的位置づけ）。

**用途**: ローカルストレージ（SQLite ベース）。`@Model` / `@Query` / `ModelContext` を提供。

#### MV パターン

**定義**: SwiftUI 向けに Apple が提唱するアーキテクチャ。Model-View の 2 層で、View が `@Query` / `@Observable` 経由で Model を直接観測する。ViewModel 層を持たない。

**根拠**: SwiftUI 自体が状態駆動型のため、ViewModel が冗長になることが多い。WWDC 2023 以降の Apple 推奨。

#### @Model

**定義**: SwiftData が提供する永続化対象クラス用のマクロ。クラスに付与すると SwiftData が永続化スキーマを生成する。

#### @Query

**定義**: SwiftUI View 内で SwiftData のフェッチを宣言するプロパティラッパー。データ変更時に自動再描画される。

#### @Observable

**定義**: クラスを SwiftUI が観測可能にするマクロ。`ObservableObject` の後継。

#### ModelContext / ModelContainer

**定義**: SwiftData のデータコンテキストとコンテナ。ModelContainer はストア全体を管理し、ModelContext は変更追跡と保存を担う。

### 略語・頭字語

#### MVP

**正式名称**: Minimum Viable Product

**意味**: 価値を提供できる最小単位の機能セット。

**本プロジェクトでの使用**: P0 機能（入力 / カレンダー / レポート / 予算 / カテゴリ管理 / 固定費）の集合を指す。

#### MV / MVVM

**正式名称**: Model-View / Model-View-ViewModel

**意味**: アーキテクチャパターン。本プロジェクトは MV を採用、MVVM は採用しない。

#### KPI

**正式名称**: Key Performance Indicator

**意味**: 主要業績評価指標。本プロジェクトでは「実機動作」「P0 機能完備」「1 ヶ月継続使用」など個人プロジェクト基準。

#### CRUD

**正式名称**: Create / Read / Update / Delete

**意味**: データ操作の基本 4 種。

#### HIG

**正式名称**: Human Interface Guidelines

**意味**: Apple のデザイン / UX ガイドライン。本プロジェクトは「iOS 標準アプリ準拠」のため HIG に準拠する。

#### JPY

**正式名称**: Japanese Yen

**意味**: 日本円。本アプリの唯一サポート通貨。
