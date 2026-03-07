/**
 * バリデーション関連のユーティリティ関数
 */

import { REGEX_PATTERNS, LIMITS, VALIDATION_CONFIG } from '../constants';
import { ValidationError, ValidationResult } from '../types/common';

/**
 * メールアドレスの検証
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // 長さチェック
  if (email.length > VALIDATION_CONFIG.EMAIL.MAX_LENGTH) {
    return false;
  }

  // パターンマッチング
  return REGEX_PATTERNS.EMAIL.test(email.trim());
}

/**
 * パスワードの検証
 */
export function isValidPassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!password || typeof password !== 'string') {
    errors.push({
      field: 'password',
      message: 'パスワードは必須です',
    });
    return { isValid: false, errors };
  }

  // 長さチェック
  if (password.length < VALIDATION_CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push({
      field: 'password',
      message: `パスワードは${VALIDATION_CONFIG.PASSWORD.MIN_LENGTH}文字以上である必要があります`,
      value: password.length,
    });
  }

  if (password.length > VALIDATION_CONFIG.PASSWORD.MAX_LENGTH) {
    errors.push({
      field: 'password',
      message: `パスワードは${VALIDATION_CONFIG.PASSWORD.MAX_LENGTH}文字以下である必要があります`,
      value: password.length,
    });
  }

  // 大文字チェック
  if (VALIDATION_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'パスワードには大文字を含む必要があります',
    });
  }

  // 小文字チェック
  if (VALIDATION_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'パスワードには小文字を含む必要があります',
    });
  }

  // 数字チェック
  if (VALIDATION_CONFIG.PASSWORD.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push({
      field: 'password',
      message: 'パスワードには数字を含む必要があります',
    });
  }

  // 特殊文字チェック
  if (VALIDATION_CONFIG.PASSWORD.REQUIRE_SPECIAL) {
    const specialChars = VALIDATION_CONFIG.PASSWORD.SPECIAL_CHARS;
    const hasSpecialChar = new RegExp(
      `[${specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`
    ).test(password);
    if (!hasSpecialChar) {
      errors.push({
        field: 'password',
        message: `パスワードには特殊文字（${specialChars}）を含む必要があります`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * タスクタイトルの検証
 */
export function isValidTaskTitle(title: string): boolean {
  if (!title || typeof title !== 'string') {
    return false;
  }

  const trimmedTitle = title.trim();

  // 空文字チェック
  if (trimmedTitle.length === 0) {
    return false;
  }

  // 長さチェック
  if (trimmedTitle.length > LIMITS.MAX_TITLE_LENGTH) {
    return false;
  }

  return true;
}

/**
 * タスクフォームの検証
 */
export interface TaskFormData {
  title: string;
  description?: string;
  date?: Date | string;
  time?: string;
  tags?: string[];
  priority?: string;
}

export function validateTaskForm(formData: TaskFormData): ValidationResult {
  const errors: ValidationError[] = [];

  // タイトル検証
  if (!formData.title || !isValidTaskTitle(formData.title)) {
    errors.push({
      field: 'title',
      message: 'タイトルは必須です（最大' + LIMITS.MAX_TITLE_LENGTH + '文字）',
      value: formData.title,
    });
  }

  // 説明文検証
  if (
    formData.description &&
    formData.description.length > LIMITS.MAX_DESCRIPTION_LENGTH
  ) {
    errors.push({
      field: 'description',
      message: `説明は${LIMITS.MAX_DESCRIPTION_LENGTH}文字以内で入力してください`,
      value: formData.description.length,
    });
  }

  // 日付検証
  if (formData.date) {
    const date =
      typeof formData.date === 'string'
        ? new Date(formData.date)
        : formData.date;
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'date',
        message: '有効な日付を入力してください',
        value: formData.date,
      });
    }
  }

  // 時刻検証
  if (formData.time && !REGEX_PATTERNS.TIME_24H.test(formData.time)) {
    errors.push({
      field: 'time',
      message: '時刻は HH:mm 形式で入力してください',
      value: formData.time,
    });
  }

  // タグ検証
  if (formData.tags && Array.isArray(formData.tags)) {
    if (formData.tags.length > LIMITS.MAX_TAGS_PER_TASK) {
      errors.push({
        field: 'tags',
        message: `タグは最大${LIMITS.MAX_TAGS_PER_TASK}個まで設定できます`,
        value: formData.tags.length,
      });
    }

    formData.tags.forEach((tag, index) => {
      if (tag.length > LIMITS.MAX_TAG_LENGTH) {
        errors.push({
          field: `tags[${index}]`,
          message: `タグは${LIMITS.MAX_TAG_LENGTH}文字以内で入力してください`,
          value: tag,
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * URL検証
 */
export function isValidURL(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  return REGEX_PATTERNS.URL.test(url);
}

/**
 * 電話番号検証
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // 最小長チェック
  if (phone.replace(/\D/g, '').length < 10) {
    return false;
  }

  return REGEX_PATTERNS.PHONE.test(phone);
}

/**
 * 色コード（HEX）の検証
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false;
  }

  return REGEX_PATTERNS.HEX_COLOR.test(color);
}

/**
 * 必須フィールドの検証
 */
export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

/**
 * 最小長の検証
 */
export function minLength(value: string | unknown[], min: number): boolean {
  if (!value) {
    return false;
  }

  if (typeof value === 'string') {
    return value.length >= min;
  }

  if (Array.isArray(value)) {
    return value.length >= min;
  }

  return false;
}

/**
 * 最大長の検証
 */
export function maxLength(value: string | unknown[], max: number): boolean {
  if (!value) {
    return true; // 空の値は最大長チェックをパス
  }

  if (typeof value === 'string') {
    return value.length <= max;
  }

  if (Array.isArray(value)) {
    return value.length <= max;
  }

  return true;
}

/**
 * 数値範囲の検証
 */
export function isInRange(value: number, min: number, max: number): boolean {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }

  return value >= min && value <= max;
}

/**
 * 日付範囲の検証
 */
export function isDateInRange(
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean {
  const targetDate = date.getTime();

  if (minDate && targetDate < minDate.getTime()) {
    return false;
  }

  if (maxDate && targetDate > maxDate.getTime()) {
    return false;
  }

  return true;
}

/**
 * ユーザー名の検証
 */
export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== 'string') {
    return false;
  }

  // 長さチェック
  if (username.length < VALIDATION_CONFIG.USERNAME.MIN_LENGTH) {
    return false;
  }

  if (username.length > VALIDATION_CONFIG.USERNAME.MAX_LENGTH) {
    return false;
  }

  // パターンマッチング
  return VALIDATION_CONFIG.USERNAME.PATTERN.test(username);
}

/**
 * ファイルサイズの検証
 */
export function isValidFileSize(
  sizeInBytes: number,
  maxSizeInBytes: number
): boolean {
  if (typeof sizeInBytes !== 'number' || sizeInBytes < 0) {
    return false;
  }

  return sizeInBytes <= maxSizeInBytes;
}

/**
 * ファイルタイプの検証
 */
export function isValidFileType(
  mimeType: string,
  allowedTypes: string[]
): boolean {
  if (!mimeType || !allowedTypes || allowedTypes.length === 0) {
    return false;
  }

  return allowedTypes.includes(mimeType.toLowerCase());
}

/**
 * 汎用バリデーター
 */
export class Validator {
  private errors: ValidationError[] = [];

  constructor(private data: Record<string, unknown>) {}

  required(field: string, message?: string): this {
    if (!isRequired(this.data[field])) {
      this.errors.push({
        field,
        message: message || `${field}は必須です`,
        value: this.data[field],
      });
    }
    return this;
  }

  email(field: string, message?: string): this {
    if (this.data[field] && !isValidEmail(this.data[field])) {
      this.errors.push({
        field,
        message: message || '有効なメールアドレスを入力してください',
        value: this.data[field],
      });
    }
    return this;
  }

  min(field: string, min: number, message?: string): this {
    if (this.data[field] && !minLength(this.data[field], min)) {
      this.errors.push({
        field,
        message: message || `${field}は${min}文字以上である必要があります`,
        value: this.data[field],
      });
    }
    return this;
  }

  max(field: string, max: number, message?: string): this {
    if (this.data[field] && !maxLength(this.data[field], max)) {
      this.errors.push({
        field,
        message: message || `${field}は${max}文字以下である必要があります`,
        value: this.data[field],
      });
    }
    return this;
  }

  pattern(field: string, pattern: RegExp, message?: string): this {
    if (this.data[field] && !pattern.test(this.data[field])) {
      this.errors.push({
        field,
        message: message || `${field}の形式が正しくありません`,
        value: this.data[field],
      });
    }
    return this;
  }

  custom(
    field: string,
    validator: (value: unknown) => boolean,
    message?: string
  ): this {
    if (!validator(this.data[field])) {
      this.errors.push({
        field,
        message: message || `${field}の検証に失敗しました`,
        value: this.data[field],
      });
    }
    return this;
  }

  validate(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
    };
  }
}
