# 設計書

## アーキテクチャ概要

UIコンポーネントライブラリとデザインシステムを階層的に構築し、再利用性と保守性を重視した設計を採用します。

```
┌─────────────────────────────────────────┐
│          Screen Components              │
│    (CalendarScreen, TaskListScreen)     │
├─────────────────────────────────────────┤
│         Common Components               │
│   (Button, Card, Input, Header)         │
├─────────────────────────────────────────┤
│          Theme System                   │
│    (Colors, Typography, Spacing)        │
├─────────────────────────────────────────┤
│        External Libraries               │
│  (React Native Elements, Reanimated)    │
└─────────────────────────────────────────┘
```

## コンポーネント設計

### 1. テーマシステム

**責務**:
- 色、フォント、スペーシングの一元管理
- デザインの一貫性保証
- 将来的なテーマ切り替えへの対応

**実装の要点**:
- TypeScriptで型安全に定義
- 定数として export して全体で使用
- 拡張可能な構造にする

### 2. Button コンポーネント

**責務**:
- タップ可能なボタンUI提供
- 複数のバリアント（primary/secondary/danger）サポート
- 無効状態の視覚的表現

**実装の要点**:
- TouchableOpacityベースで実装
- アクセシビリティ対応
- Haptic Feedbackの実装

### 3. Card コンポーネント

**責務**:
- コンテンツのグループ化
- 影と境界線による視覚的分離
- 柔軟なレイアウト対応

**実装の要点**:
- Shadow設定はプラットフォーム別に対応
- 子要素の柔軟な配置

### 4. Input コンポーネント

**責務**:
- テキスト入力フィールド提供
- バリデーションエラー表示
- ラベル、プレースホルダー、ヘルパーテキスト

**実装の要点**:
- TextInputベースで実装
- エラー状態の視覚的フィードバック
- キーボード回避動作

### 5. TaskCard コンポーネント

**責務**:
- タスク情報の表示
- スワイプジェスチャーによるアクション
- 完了状態の視覚表現

**実装の要点**:
- Gesture Handlerによるスワイプ実装
- Reanimatedによるスムーズなアニメーション

### 6. CalendarDay コンポーネント

**責務**:
- カレンダーの日付セル表示
- 選択状態、今日の日付強調
- イベント/タスクインジケーター

**実装の要点**:
- タップ可能な日付セル
- 複数の状態に対応したスタイリング

## データフロー

### コンポーネント利用フロー
```
1. Screen Component がテーマから色/フォントを取得
2. 共通コンポーネントをインポートして配置
3. Props経由でデータとコールバックを渡す
4. ユーザーインタラクションをコールバック経由で親に通知
```

## エラーハンドリング戦略

### カスタムエラークラス

UIコンポーネントレベルでは特別なエラークラスは定義せず、親コンポーネントからのエラー情報を表示するのみとします。

### エラーハンドリングパターン

- Input: エラーメッセージをPropsで受け取り表示
- Button: 無効状態で操作を防ぐ
- その他: エラー状態の視覚的フィードバック

## テスト戦略

### ユニットテスト
- 各コンポーネントのレンダリング
- Props変更時の表示更新
- イベントハンドラーの呼び出し

### 統合テスト
- テーマ適用の確認
- コンポーネント間の連携
- プラットフォーム別の表示確認

## 依存ライブラリ

```json
{
  "dependencies": {
    "react-native-elements": "^3.4.3",
    "react-native-vector-icons": "^10.0.0",
    "react-native-calendars": "^1.1300.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-reanimated": "^3.6.0",
    "react-native-safe-area-context": "^4.8.0"
  }
}
```

## ディレクトリ構造

```
src/
├── theme/
│   ├── colors.ts       # カラーテーマ定義
│   ├── typography.ts   # タイポグラフィ定義
│   ├── spacing.ts      # スペーシング定義
│   └── index.ts        # テーマ統合エクスポート
│
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── Card.styles.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.styles.ts
│   │   │   └── index.ts
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.styles.ts
│   │   │   └── index.ts
│   │   └── Icon/
│   │       ├── Icon.tsx
│   │       └── index.ts
│   │
│   ├── task/
│   │   └── TaskCard/
│   │       ├── TaskCard.tsx
│   │       ├── TaskCard.styles.ts
│   │       └── index.ts
│   │
│   └── calendar/
│       └── CalendarDay/
│           ├── CalendarDay.tsx
│           ├── CalendarDay.styles.ts
│           └── index.ts
│
└── utils/
    └── animations.ts    # アニメーションユーティリティ
```

## 実装の順序

1. 依存ライブラリのインストールと設定
2. テーマシステムの実装（colors, typography, spacing）
3. 基本的な共通コンポーネントの実装（Button, Card, Input）
4. Iconコンポーネントの実装
5. Headerコンポーネントの実装
6. TaskCardコンポーネントの実装（Gesture Handler使用）
7. CalendarDayコンポーネントの実装
8. アニメーションユーティリティの作成

## セキュリティ考慮事項

- ユーザー入力のサニタイゼーションは親コンポーネントで実施
- 機密情報をコンポーネントのPropsに含めない

## パフォーマンス考慮事項

- React.memoによるコンポーネントのメモ化
- スタイルシートの事前作成（StyleSheet.create使用）
- 重いアニメーションは InteractionManager.runAfterInteractions で実行
- FlatListなどのリストコンポーネント使用時の最適化

## 将来の拡張性

- テーマオブジェクトを拡張可能な構造にする
- コンポーネントのバリアント追加が容易な設計
- ダークモード対応を見据えた色定義
- 国際化対応を考慮したタイポグラフィ設計