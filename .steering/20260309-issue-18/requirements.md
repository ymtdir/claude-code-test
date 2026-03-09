# Issue #18: 【Step 4】ナビゲーション実装 - React Navigationの設定

## 概要
React Navigation 6を使用して、アプリ内の画面遷移を管理するナビゲーション構造を実装します。タブナビゲーション、スタックナビゲーション、モーダル表示を組み合わせた構造を構築します。

## 実装内容

### 1. React Navigationのインストール
```bash
npm install @react-navigation/native
npm install @react-navigation/bottom-tabs
npm install @react-navigation/stack
npm install react-native-screens
```

### 2. ナビゲーション構造の実装
```typescript
// src/navigation/AppNavigator.tsx
- RootNavigator（全体）
  - MainTabNavigator（タブ）
    - CalendarStack（カレンダー関連）
    - StatisticsStack（統計関連）
    - SettingsStack（設定関連）
  - ModalStack（モーダル）
    - TaskAddModal
    - TaskEditModal
    - ReminderModal
```

### 3. タブナビゲーターの実装
```typescript
// src/navigation/MainTabNavigator.tsx
const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

### 4. スタックナビゲーターの実装
```typescript
// src/navigation/CalendarStack.tsx
const Stack = createStackNavigator();

export function CalendarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MonthView" component={MonthViewScreen} />
      <Stack.Screen name="WeekView" component={WeekViewScreen} />
      <Stack.Screen name="DayView" component={DayViewScreen} />
    </Stack.Navigator>
  );
}
```

### 5. ナビゲーション型定義
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Main: undefined;
  TaskAdd: { date?: string };
  TaskEdit: { taskId: string };
  Reminder: { taskId: string };
};

export type MainTabParamList = {
  Calendar: undefined;
  Statistics: undefined;
  Settings: undefined;
};
```

### 6. 画面遷移フックの実装
```typescript
// src/hooks/useNavigation.ts
import { useNavigation } from '@react-navigation/native';
```

### 7. プレースホルダー画面の作成
- CalendarScreen
- StatisticsScreen
- SettingsScreen
- TaskAddScreen
- TaskEditScreen

## 受け入れ条件

- [ ] React Navigation 6が正しくインストールされている
- [ ] タブナビゲーションが動作する
- [ ] 各タブから詳細画面への遷移が動作する
- [ ] モーダル画面が表示される
- [ ] TypeScriptの型が正しく設定されている
- [ ] 画面間でパラメータが渡せる
- [ ] ナビゲーションヘッダーが表示される
- [ ] 戻るボタンが正しく動作する

## 必要な技術/ライブラリ

- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/stack
- react-native-screens
- react-native-safe-area-context

## 依存関係

- #15 【Step 1】開発環境セットアップが完了していること
- #16 【Step 2】基本プロジェクト構造が完了していること
- #17 【Step 3】UIコンポーネントライブラリ導入が完了していること

## 参考リンク

- [React Navigation Documentation](https://reactnavigation.org/)
- [TypeScript with React Navigation](https://reactnavigation.org/docs/typescript/)

## 成果物

- 設定済みのナビゲーション構造
- タブナビゲーター
- スタックナビゲーター
- ナビゲーション型定義
- プレースホルダー画面
- 動作する画面遷移