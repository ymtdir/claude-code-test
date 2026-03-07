/**
 * ストレージ関連のユーティリティ関数
 * React Native WebではlocalStorageを使用
 */

import { STORAGE_KEYS } from '../constants';

// ストレージタイプ
type StorageType = 'local' | 'session';

// ストレージインターフェース
interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

// ブラウザストレージラッパー
class BrowserStorage implements IStorage {
  private storage: Storage;

  constructor(type: StorageType = 'local') {
    this.storage = type === 'session' ? sessionStorage : localStorage;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }
}

// ストレージインスタンス
const storage = new BrowserStorage('local');

/**
 * ストレージからアイテムを取得
 */
export async function getItem<T = unknown>(key: string): Promise<T | null> {
  try {
    const value = await storage.getItem(key);
    if (value === null) {
      return null;
    }

    // JSONパースを試みる
    try {
      return JSON.parse(value) as T;
    } catch {
      // パースに失敗した場合は文字列として返す
      return value as T;
    }
  } catch (error) {
    console.error('getItem error:', error);
    return null;
  }
}

/**
 * ストレージにアイテムを保存
 */
export async function setItem<T = unknown>(
  key: string,
  value: T
): Promise<boolean> {
  try {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    await storage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error('setItem error:', error);
    return false;
  }
}

/**
 * ストレージからアイテムを削除
 */
export async function removeItem(key: string): Promise<boolean> {
  try {
    await storage.removeItem(key);
    return true;
  } catch (error) {
    console.error('removeItem error:', error);
    return false;
  }
}

/**
 * ストレージをクリア
 */
export async function clear(): Promise<boolean> {
  try {
    await storage.clear();
    return true;
  } catch (error) {
    console.error('clear error:', error);
    return false;
  }
}

/**
 * 複数のアイテムを一度に取得
 */
export async function multiGet<T = unknown>(
  keys: string[]
): Promise<Map<string, T | null>> {
  const result = new Map<string, T | null>();

  for (const key of keys) {
    const value = await getItem<T>(key);
    result.set(key, value);
  }

  return result;
}

/**
 * 複数のアイテムを一度に保存
 */
export async function multiSet(
  items: Record<string, unknown>
): Promise<boolean> {
  try {
    for (const [key, value] of Object.entries(items)) {
      await setItem(key, value);
    }
    return true;
  } catch (error) {
    console.error('multiSet error:', error);
    return false;
  }
}

/**
 * 複数のアイテムを一度に削除
 */
export async function multiRemove(keys: string[]): Promise<boolean> {
  try {
    for (const key of keys) {
      await removeItem(key);
    }
    return true;
  } catch (error) {
    console.error('multiRemove error:', error);
    return false;
  }
}

/**
 * ストレージ内のすべてのキーを取得
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    return await storage.getAllKeys();
  } catch (error) {
    console.error('getAllKeys error:', error);
    return [];
  }
}

/**
 * 特定のプレフィックスを持つキーを取得
 */
export async function getKeysWithPrefix(prefix: string): Promise<string[]> {
  const allKeys = await getAllKeys();
  return allKeys.filter((key) => key.startsWith(prefix));
}

/**
 * ストレージのサイズを取得（概算）
 */
export async function getStorageSize(): Promise<number> {
  try {
    const keys = await getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await storage.getItem(key);
      if (value) {
        // キーと値のサイズを計算（文字数 × 2バイトで概算）
        totalSize += (key.length + value.length) * 2;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('getStorageSize error:', error);
    return 0;
  }
}

/**
 * 認証トークンを保存
 */
export async function saveAuthToken(token: string): Promise<boolean> {
  return setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * 認証トークンを取得
 */
export async function getAuthToken(): Promise<string | null> {
  return getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * 認証トークンを削除
 */
export async function removeAuthToken(): Promise<boolean> {
  return removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * リフレッシュトークンを保存
 */
export async function saveRefreshToken(token: string): Promise<boolean> {
  return setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

/**
 * リフレッシュトークンを取得
 */
export async function getRefreshToken(): Promise<string | null> {
  return getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * ユーザーデータを保存
 */
export async function saveUserData(userData: unknown): Promise<boolean> {
  return setItem(STORAGE_KEYS.USER_DATA, userData);
}

/**
 * ユーザーデータを取得
 */
export async function getUserData<T = unknown>(): Promise<T | null> {
  return getItem<T>(STORAGE_KEYS.USER_DATA);
}

/**
 * アプリ設定を保存
 */
export async function saveSettings(settings: unknown): Promise<boolean> {
  return setItem(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * アプリ設定を取得
 */
export async function getSettings<T = unknown>(): Promise<T | null> {
  return getItem<T>(STORAGE_KEYS.SETTINGS);
}

/**
 * 言語設定を保存
 */
export async function saveLanguage(language: string): Promise<boolean> {
  return setItem(STORAGE_KEYS.LANGUAGE, language);
}

/**
 * 言語設定を取得
 */
export async function getLanguage(): Promise<string | null> {
  return getItem<string>(STORAGE_KEYS.LANGUAGE);
}

/**
 * テーマ設定を保存
 */
export async function saveTheme(theme: string): Promise<boolean> {
  return setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * テーマ設定を取得
 */
export async function getTheme(): Promise<string | null> {
  return getItem<string>(STORAGE_KEYS.THEME);
}

/**
 * キャッシュデータを保存（有効期限付き）
 */
export interface CacheData<T = unknown> {
  data: T;
  timestamp: number;
  expiresIn?: number; // ミリ秒
}

export async function setCacheItem<T = unknown>(
  key: string,
  data: T,
  expiresIn?: number
): Promise<boolean> {
  const cacheData: CacheData<T> = {
    data,
    timestamp: Date.now(),
    expiresIn,
  };

  return setItem(key, cacheData);
}

/**
 * キャッシュデータを取得（有効期限チェック付き）
 */
export async function getCacheItem<T = unknown>(
  key: string
): Promise<T | null> {
  const cacheData = await getItem<CacheData<T>>(key);

  if (!cacheData || !cacheData.timestamp) {
    return null;
  }

  // 有効期限チェック
  if (cacheData.expiresIn) {
    const now = Date.now();
    const expirationTime = cacheData.timestamp + cacheData.expiresIn;

    if (now > expirationTime) {
      // 期限切れの場合は削除して null を返す
      await removeItem(key);
      return null;
    }
  }

  return cacheData.data;
}

/**
 * 期限切れキャッシュをクリーンアップ
 */
export async function cleanupExpiredCache(): Promise<number> {
  const keys = await getAllKeys();
  let cleanedCount = 0;

  for (const key of keys) {
    const cacheData = await getItem<CacheData>(key);

    if (cacheData && cacheData.timestamp && cacheData.expiresIn) {
      const now = Date.now();
      const expirationTime = cacheData.timestamp + cacheData.expiresIn;

      if (now > expirationTime) {
        await removeItem(key);
        cleanedCount++;
      }
    }
  }

  return cleanedCount;
}

/**
 * ユーザーセッションをクリア
 */
export async function clearUserSession(): Promise<boolean> {
  const keysToRemove = [
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.USER_DATA,
  ];

  return multiRemove(keysToRemove);
}

/**
 * ストレージのエクスポート（バックアップ用）
 */
export async function exportStorage(): Promise<Record<string, unknown>> {
  const keys = await getAllKeys();
  const data: Record<string, unknown> = {};

  for (const key of keys) {
    const value = await getItem(key);
    if (value !== null) {
      data[key] = value;
    }
  }

  return data;
}

/**
 * ストレージのインポート（リストア用）
 */
export async function importStorage(
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    for (const [key, value] of Object.entries(data)) {
      await setItem(key, value);
    }
    return true;
  } catch (error) {
    console.error('importStorage error:', error);
    return false;
  }
}
