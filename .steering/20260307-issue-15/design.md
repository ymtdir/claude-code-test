# 設計書 - React Native + Expo環境構築

## 解決アプローチ

このIssueは、UnifiedCalアプリケーション開発のための基本的な開発環境を構築するものです。React Native + Expo + TypeScriptを使用したモダンなクロスプラットフォーム開発環境を整備します。

## 実装戦略

### 1. プロジェクト構成の確認

現在のプロジェクトは通常のWebアプリケーション（React + Vite）として構成されています。このIssueの要件に従い、React Native + Expoベースのモバイルアプリケーション開発環境として再構築する必要があります。

### 2. 段階的な実装

#### Phase 1: Expo プロジェクトの初期化
- `npx create-expo-app`を使用して新しいExpoプロジェクトを作成
- TypeScriptテンプレートを選択
- 基本的なプロジェクト構造の確立

#### Phase 2: TypeScript設定の最適化
- tsconfig.jsonの調整
- React Native用の型定義ファイルの追加
- strictモードの有効化

#### Phase 3: 開発ツールの設定
- ESLint設定（React Native/Expo対応）
- Prettier設定（コードフォーマット）
- EditorConfig設定（エディタ設定の統一）
- VS Code推奨拡張機能の設定

#### Phase 4: ドキュメント作成
- README.mdに環境構築手順を記載
- 開発環境のセットアップガイド
- トラブルシューティング情報

## ディレクトリ構造

```
UnifiedCal/
├── app/                    # Expo Router用のアプリケーションコード
│   ├── (tabs)/            # タブナビゲーション
│   └── _layout.tsx        # ルートレイアウト
├── components/            # 再利用可能なコンポーネント
├── constants/             # 定数定義
├── hooks/                 # カスタムフック
├── assets/                # 画像、フォントなどのアセット
├── .expo/                 # Expo設定（自動生成）
├── node_modules/          # 依存パッケージ
├── .eslintrc.json         # ESLint設定
├── .prettierrc            # Prettier設定
├── .editorconfig          # EditorConfig設定
├── tsconfig.json          # TypeScript設定
├── app.json               # Expo設定
├── package.json           # プロジェクト設定
└── README.md              # プロジェクトドキュメント
```

## 技術的な考慮事項

### TypeScript設定
- React Native特有の型定義を適切に設定
- パスエイリアスの設定
- strictモードでの型安全性の確保

### Linter/Formatter設定
- React Native特有のルール設定
- Expo推奨の設定を採用
- チーム開発に適した設定

### 開発環境
- Node.js v25（現在インストール済み）はv20以上なので要件を満たす
- Expo SDK最新版を使用
- iOS/Android両方の開発環境をサポート

## リスクと対策

### リスク1: 既存プロジェクトとの競合
- 対策: 新しいディレクトリ（UnifiedCal/）に完全に独立したプロジェクトとして作成

### リスク2: 環境依存の問題
- 対策: プラットフォーム別の設定手順をREADMEに明記

### リスク3: バージョンの互換性
- 対策: Expo SDKの最新安定版を使用し、依存関係を適切に管理

## コミット計画

1. `feat: Expoプロジェクトの初期化`
2. `feat: TypeScript設定の追加と最適化`
3. `feat: ESLint設定の追加`
4. `feat: Prettier設定の追加`
5. `feat: EditorConfigとVS Code設定の追加`
6. `docs: README.mdに環境構築手順を記載`
7. `test: 初期プロジェクトの動作確認`