# Issue #15 要件

## 概要
UnifiedCalアプリ開発のための基本的な開発環境を構築します。React Native、TypeScript、Expoを使用したクロスプラットフォーム開発環境を整備します。

## 実装内容

### 1. 開発ツールのインストール
- Node.js v20+ のインストールと設定
- npmまたはyarnの設定
- React Native CLI のインストール
- Expo CLI のインストール

### 2. プロジェクト初期化
```bash
npx create-expo-app UnifiedCal --template
cd UnifiedCal
```

### 3. TypeScript設定
- TypeScript 5.9+ の導入
- tsconfig.json の設定
- 型定義ファイルの追加

### 4. 開発用エディタ設定
- VS Code推奨拡張機能の設定
- ESLint設定
- Prettier設定
- EditorConfig設定

### 5. デバイス設定
- iOS Simulator（Mac環境）
- Android Emulator
- Expo Goアプリでの実機テスト設定

## 受け入れ条件

- [ ] Node.js v20以上がインストールされている
- [ ] Expo SDK 50以上でプロジェクトが初期化されている
- [ ] TypeScript 5.9以上が設定されている
- [ ] iOS Simulatorでアプリが起動する（Mac環境）
- [ ] Android Emulatorでアプリが起動する
- [ ] Expo Goアプリで実機テストができる
- [ ] ESLintとPrettierが正常に動作する

## 必要な技術/ライブラリ

- Node.js v20+
- React Native 0.73+
- TypeScript 5.9+
- Expo SDK 50+
- ESLint
- Prettier

## 依存関係

なし（最初のステップ）

## 参考リンク

- [React Native 環境構築ガイド](https://reactnative.dev/docs/environment-setup)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript設定ガイド](https://www.typescriptlang.org/docs/handbook/react.html)

## 成果物

- 初期化されたReact Native + Expoプロジェクト
- 設定済みのpackage.json
- TypeScript設定（tsconfig.json）
- Linter設定（.eslintrc、.prettierrc）
- README.mdに環境構築手順を記載