/**
 * 定数定義のメインエクスポート
 */

export * from './colors';
export * from './config';
export * from './messages';

// アプリケーション基本情報
export const APP_NAME = 'UnifiedCal';
export const APP_VERSION = '1.0.0';
export const APP_BUILD = '1';
export const APP_BUNDLE_ID = 'com.unifiedcal.app';

// API設定
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://api.unifiedcal.com';
export const API_TIMEOUT = 30000; // 30秒
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY = 1000; // 1秒

// ストレージキー
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@unifiedcal:auth_token',
  REFRESH_TOKEN: '@unifiedcal:refresh_token',
  USER_DATA: '@unifiedcal:user_data',
  SETTINGS: '@unifiedcal:settings',
  THEME: '@unifiedcal:theme',
  LANGUAGE: '@unifiedcal:language',
  CALENDAR_CACHE: '@unifiedcal:calendar_cache',
  TASK_CACHE: '@unifiedcal:task_cache',
  LAST_SYNC: '@unifiedcal:last_sync',
} as const;

// デフォルト値
export const DEFAULTS = {
  LANGUAGE: 'ja',
  THEME: 'light',
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm',
  FIRST_DAY_OF_WEEK: 1, // Monday
  REMINDER_MINUTES: 15,
  TASK_PRIORITY: 'medium',
  CALENDAR_VIEW: 'month',
  PAGE_SIZE: 20,
  MAX_FILE_SIZE: 10485760, // 10MB
  MAX_ATTACHMENTS: 5,
  SESSION_TIMEOUT: 3600000, // 1時間
} as const;

// 制限値
export const LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_TAG_LENGTH: 50,
  MAX_TAGS_PER_TASK: 10,
  MAX_SUBTASKS: 20,
  MAX_REMINDERS: 5,
  MAX_SHARED_USERS: 50,
  MIN_SEARCH_LENGTH: 2,
} as const;

// アニメーション設定
export const ANIMATION = {
  DURATION_FAST: 200,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
  EASING: 'ease-in-out',
} as const;

// ブレークポイント（レスポンシブデザイン用）
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
} as const;

// 正規表現パターン
export const REGEX_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^[\d\s\-+()]+$/,
  URL: /^https?:\/\/.+/i,
  TIME_24H: /^([01]?\d|2[0-3]):[0-5]\d$/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
} as const;

// HTTPステータスコード
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// キーボードショートカット
export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: 'cmd+n',
  SEARCH: 'cmd+k',
  SAVE: 'cmd+s',
  DELETE: 'cmd+d',
  UNDO: 'cmd+z',
  REDO: 'cmd+shift+z',
  TOGGLE_SIDEBAR: 'cmd+b',
  TODAY: 't',
  NEXT_DAY: 'j',
  PREV_DAY: 'k',
  NEXT_WEEK: 'w',
  PREV_WEEK: 'shift+w',
} as const;

// サポートされるファイルタイプ
export const SUPPORTED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  SPREADSHEET: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  TEXT: ['text/plain', 'text/csv'],
} as const;

// ソーシャルメディア
export const SOCIAL_LINKS = {
  WEBSITE: 'https://unifiedcal.com',
  SUPPORT: 'https://support.unifiedcal.com',
  TWITTER: 'https://twitter.com/unifiedcal',
  GITHUB: 'https://github.com/unifiedcal',
  DISCORD: 'https://discord.gg/unifiedcal',
} as const;
