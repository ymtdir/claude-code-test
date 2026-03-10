/**
 * 日本の祝日データ管理
 * 2026年の祝日データを定義
 */

export interface Holiday {
  date: string; // YYYY-MM-DD format
  name: string;
  type: 'national' | 'substitute'; // 国民の祝日 or 振替休日
}

// 2026年の日本の祝日
export const HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-01', name: '元日', type: 'national' },
  { date: '2026-01-12', name: '成人の日', type: 'national' },
  { date: '2026-02-11', name: '建国記念の日', type: 'national' },
  { date: '2026-02-23', name: '天皇誕生日', type: 'national' },
  { date: '2026-03-20', name: '春分の日', type: 'national' },
  { date: '2026-04-29', name: '昭和の日', type: 'national' },
  { date: '2026-05-03', name: '憲法記念日', type: 'national' },
  { date: '2026-05-04', name: 'みどりの日', type: 'national' },
  { date: '2026-05-05', name: 'こどもの日', type: 'national' },
  { date: '2026-05-06', name: '振替休日', type: 'substitute' },
  { date: '2026-07-20', name: '海の日', type: 'national' },
  { date: '2026-08-11', name: '山の日', type: 'national' },
  { date: '2026-09-21', name: '敬老の日', type: 'national' },
  { date: '2026-09-22', name: '国民の休日', type: 'national' },
  { date: '2026-09-23', name: '秋分の日', type: 'national' },
  { date: '2026-10-12', name: 'スポーツの日', type: 'national' },
  { date: '2026-11-03', name: '文化の日', type: 'national' },
  { date: '2026-11-23', name: '勤労感謝の日', type: 'national' },
];

// 祝日の色設定
export const HOLIDAY_COLOR = '#FF6B6B';
export const SUBSTITUTE_HOLIDAY_COLOR = '#FF8787';

/**
 * 指定された日付が祝日かどうかを判定
 * @param date YYYY-MM-DD形式の日付文字列
 * @returns 祝日の情報、祝日でない場合はnull
 */
export const getHoliday = (date: string): Holiday | null => {
  return HOLIDAYS_2026.find((holiday) => holiday.date === date) || null;
};

/**
 * 指定された月の祝日を取得
 * @param year 年
 * @param month 月（1-12）
 * @returns 該当月の祝日リスト
 */
export const getHolidaysByMonth = (year: number, month: number): Holiday[] => {
  const monthStr = String(month).padStart(2, '0');
  const yearMonthPrefix = `${year}-${monthStr}`;

  return HOLIDAYS_2026.filter((holiday) =>
    holiday.date.startsWith(yearMonthPrefix)
  );
};

/**
 * 指定された年の祝日を取得
 * @param year 年
 * @returns 該当年の祝日リスト
 */
export const getHolidaysByYear = (year: number): Holiday[] => {
  if (year !== 2026) {
    console.warn(
      `祝日データは2026年のみ定義されています。${year}年のデータはありません。`
    );
    return [];
  }
  return HOLIDAYS_2026;
};

/**
 * 日付が土日祝日かどうかを判定
 * @param date Date オブジェクト
 * @returns 土日祝日の場合true
 */
export const isWeekendOrHoliday = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  // 土曜日(6)または日曜日(0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }

  // 祝日チェック
  const dateStr = date.toISOString().split('T')[0];
  return getHoliday(dateStr) !== null;
};

/**
 * 指定された月の祝日マップを生成
 * @param year 年
 * @param month 月（1-12）
 * @returns 日付をキー、祝日名を値とするオブジェクト
 */
export const getHolidayMap = (
  year: number,
  month: number
): Record<string, string> => {
  const holidayMap: Record<string, string> = {};
  const holidays = getHolidaysByMonth(year, month);

  holidays.forEach((holiday) => {
    holidayMap[holiday.date] = holiday.name;
  });

  return holidayMap;
};

/**
 * 曜日の日本語表記を取得
 * @param dayOfWeek 曜日（0-6、0が日曜日）
 * @returns 曜日の日本語文字列
 */
export const getDayOfWeekJapanese = (dayOfWeek: number): string => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[dayOfWeek];
};

/**
 * 日付の表示色を取得（土日祝日で色分け）
 * @param date Date オブジェクト
 * @returns カラーコード
 */
export const getDateColor = (date: Date): string => {
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().split('T')[0];
  const holiday = getHoliday(dateStr);

  // 祝日の場合
  if (holiday) {
    return holiday.type === 'substitute'
      ? SUBSTITUTE_HOLIDAY_COLOR
      : HOLIDAY_COLOR;
  }

  // 日曜日
  if (dayOfWeek === 0) {
    return HOLIDAY_COLOR;
  }

  // 土曜日
  if (dayOfWeek === 6) {
    return '#4A90E2';
  }

  // 平日
  return '#2C3E50';
};
