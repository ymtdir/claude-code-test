/**
 * UnifiedCal カラーテーマ定義
 *
 * アプリケーション全体で使用される色の定義
 */

export const Colors = {
  // プライマリーカラー
  primary: '#4A90E2', // ソフトブルー（メインアクセント）
  primaryLight: '#7AB3F0',
  primaryDark: '#357ABD',

  // セカンダリーカラー
  secondary: '#FF6B6B', // コーラルピンク（セカンダリーアクション）
  secondaryLight: '#FF9999',
  secondaryDark: '#CC5555',

  // ステータスカラー
  success: '#4ECDC4', // ミントグリーン（成功状態）
  successLight: '#7EDAD4',
  successDark: '#3CA59E',

  warning: '#FFD93D', // サンセットイエロー（警告）
  warningLight: '#FFEB8C',
  warningDark: '#E6C230',

  error: '#FF5252', // エラーレッド
  errorLight: '#FF8A80',
  errorDark: '#C62828',

  info: '#2196F3', // インフォブルー
  infoLight: '#64B5F6',
  infoDark: '#1976D2',

  // ニュートラルカラー
  background: '#F8F9FA', // ライトグレー（背景）
  surface: '#FFFFFF', // 白（カード背景）

  // テキストカラー
  textPrimary: '#2C3E50', // チャコール（主要テキスト）
  textSecondary: '#95A5A6', // ミディアムグレー（補助テキスト）
  textDisabled: '#BDC3C7', // 無効状態テキスト
  textInverse: '#FFFFFF', // 反転テキスト（ダーク背景用）

  // ボーダー・区切り線
  border: '#E1E8ED',
  borderLight: '#F0F3F5',
  borderDark: '#CBD5DC',

  // 影
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',

  // オーバーレイ
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  // カレンダー関連
  calendarToday: '#4A90E2', // 今日の日付
  calendarSelected: '#FF6B6B', // 選択された日付
  calendarWeekend: '#FF9999', // 週末
  calendarHoliday: '#FF5252', // 祝日

  // タスク優先度
  priorityHigh: '#FF5252',
  priorityMedium: '#FFD93D',
  priorityLow: '#4ECDC4',
  priorityNone: '#95A5A6',

  // カテゴリーカラー（タスク用）
  categoryWork: '#4A90E2',
  categoryPersonal: '#FF6B6B',
  categoryHealth: '#4ECDC4',
  categoryShopping: '#FFD93D',
  categoryStudy: '#9B59B6',
  categoryOther: '#95A5A6',
} as const;

// 型定義
export type ColorName = keyof typeof Colors;
export type ColorValue = (typeof Colors)[ColorName];

// ヘルパー関数：透明度を適用
export const withOpacity = (color: ColorValue, opacity: number): string => {
  // HEXカラーをRGBAに変換
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// テーマプリセット（将来のダークモード対応用）
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const lightTheme: ThemeColors = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  background: Colors.background,
  surface: Colors.surface,
  textPrimary: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  border: Colors.border,
  success: Colors.success,
  warning: Colors.warning,
  error: Colors.error,
  info: Colors.info,
};

// エクスポート
export default Colors;
