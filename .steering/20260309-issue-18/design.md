# ナビゲーション実装設計

## 実装アプローチ

### 1. パッケージのインストール
React Navigation 6系のWebベース実装を使用します。React Native固有のパッケージは使用せず、Webプラットフォームで動作する実装を行います。

### 2. ディレクトリ構造
```
src/
  navigation/
    types.ts           # 型定義
    AppNavigator.tsx   # ルートナビゲーター
    MainTabNavigator.tsx # タブナビゲーター
    stacks/
      CalendarStack.tsx
      StatisticsStack.tsx
      SettingsStack.tsx
  screens/
    calendar/
      CalendarScreen.tsx
      MonthViewScreen.tsx
      WeekViewScreen.tsx
      DayViewScreen.tsx
    statistics/
      StatisticsScreen.tsx
    settings/
      SettingsScreen.tsx
    modals/
      TaskAddScreen.tsx
      TaskEditScreen.tsx
      ReminderScreen.tsx
```

### 3. 実装順序

1. **型定義の作成**
   - ナビゲーションパラメータの型定義
   - 画面プロップスの型定義

2. **プレースホルダー画面の作成**
   - 各画面の基本コンポーネント作成
   - デザインシステムのコンポーネントを使用

3. **ナビゲーター実装**
   - タブナビゲーター
   - 各スタックナビゲーター
   - ルートナビゲーター

4. **App.tsxへの統合**
   - NavigationContainerの設定
   - ナビゲーターの配置

### 4. Web向けの調整

React NavigationはReact Native向けのライブラリですが、今回はVite + React (Web)環境のため、以下の対応を行います：

- React Router v6を使用したルーティング実装
- タブUIはカスタムコンポーネントで実装
- モーダルはReactのポータルで実装
- URLとの同期を考慮

### 5. コミット戦略

各機能単位で細かくコミットします：
- feat: ナビゲーション型定義を追加
- feat: プレースホルダー画面を作成
- feat: タブナビゲーションコンポーネントを実装
- feat: ルーティング設定を追加
- feat: モーダル表示機能を実装

## 技術的考慮事項

### React Router v6の採用理由
- Vite + React (Web)環境に最適
- URLベースのルーティング
- ネストされたルートのサポート
- 型安全性の確保が容易

### UI実装方針
- 既存のデザインシステムコンポーネントを活用
- レスポンシブデザインを考慮
- アクセシビリティ対応

## リスクと対策

### リスク
- React NavigationはReact Native向けのため、Web環境では動作しない

### 対策
- React Router v6を使用してWeb向けに実装
- タブUIやモーダルはカスタム実装
- ナビゲーションのAPIはReact Navigation風に保つことで、将来的な移行を容易にする