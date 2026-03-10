/**
 * 六曜（ろくよう）計算ユーティリティ
 * 日本の伝統的な暦注の一つで、日にちの吉凶を表す
 */

// 六曜の種類
export const ROKUYOU = {
  SENSHOU: '先勝', // せんしょう、せんかち
  TOMOBIKI: '友引', // ともびき
  SENBU: '先負', // せんぶ、せんまけ
  BUTSUMETSU: '仏滅', // ぶつめつ
  TAIAN: '大安', // たいあん
  SHAKKOU: '赤口', // しゃっこう、しゃっく
} as const;

// 六曜の配列（旧暦の月日から算出する際に使用）
const ROKUYOU_ARRAY = [
  ROKUYOU.SENSHOU,
  ROKUYOU.TOMOBIKI,
  ROKUYOU.SENBU,
  ROKUYOU.BUTSUMETSU,
  ROKUYOU.TAIAN,
  ROKUYOU.SHAKKOU,
];

// 六曜の説明
export const ROKUYOU_DESCRIPTIONS = {
  [ROKUYOU.SENSHOU]: '午前中は吉、午後は凶',
  [ROKUYOU.TOMOBIKI]: '朝晩は吉、昼は凶。祝い事は避ける',
  [ROKUYOU.SENBU]: '午前中は凶、午後は吉',
  [ROKUYOU.BUTSUMETSU]: '万事に凶とされる日',
  [ROKUYOU.TAIAN]: '万事に吉とされる最も良い日',
  [ROKUYOU.SHAKKOU]: '正午のみ吉、他は凶。特に祝い事は大凶',
} as const;

// 六曜の色（カレンダー表示用）
export const ROKUYOU_COLORS = {
  [ROKUYOU.SENSHOU]: '#4A90E2',
  [ROKUYOU.TOMOBIKI]: '#95A5A6',
  [ROKUYOU.SENBU]: '#FFD93D',
  [ROKUYOU.BUTSUMETSU]: '#2C3E50',
  [ROKUYOU.TAIAN]: '#FF6B6B',
  [ROKUYOU.SHAKKOU]: '#E74C3C',
} as const;

/**
 * 新暦から旧暦への簡易変換
 * 注意: これは簡易的な計算で、厳密な旧暦とは異なります
 * @param date 新暦の日付
 * @returns 旧暦の月と日（簡易計算）
 */
const getSimpleLunarDate = (date: Date): { month: number; day: number } => {
  // 簡易的に新暦から約1ヶ月遅れとして計算
  // const year = date.getFullYear(); // 将来の改良版で使用予定
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 簡易計算（実際の旧暦とは異なります）
  let lunarMonth = month;
  let lunarDay = day;

  // 月初の場合は前月扱いにする簡易ルール
  if (day <= 2) {
    lunarMonth = month === 1 ? 12 : month - 1;
    lunarDay = day + 28;
  }

  return { month: lunarMonth, day: lunarDay };
};

/**
 * 指定された日付の六曜を計算
 * 六曜は旧暦の月と日を足した数を6で割った余りで決まる
 * @param date 計算対象の日付
 * @returns 六曜の文字列
 */
export const getRokuyou = (date: Date): string => {
  const { month, day } = getSimpleLunarDate(date);

  // 旧暦の月と日を足して6で割った余り
  const index = (month + day) % 6;

  return ROKUYOU_ARRAY[index];
};

/**
 * 指定された月の全日付の六曜を計算
 * @param year 年
 * @param month 月（1-12）
 * @returns 日付をキー、六曜を値とするオブジェクト
 */
export const getRokuyouForMonth = (
  year: number,
  month: number
): Record<string, string> => {
  const rokuyouMap: Record<string, string> = {};
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    rokuyouMap[dateString] = getRokuyou(date);
  }

  return rokuyouMap;
};

/**
 * 六曜が吉日かどうかを判定
 * @param rokuyou 六曜の文字列
 * @returns 吉日の場合true
 */
export const isLuckyDay = (rokuyou: string): boolean => {
  return rokuyou === ROKUYOU.TAIAN || rokuyou === ROKUYOU.SENSHOU;
};

/**
 * 六曜が凶日かどうかを判定
 * @param rokuyou 六曜の文字列
 * @returns 凶日の場合true
 */
export const isUnluckyDay = (rokuyou: string): boolean => {
  return rokuyou === ROKUYOU.BUTSUMETSU || rokuyou === ROKUYOU.SHAKKOU;
};
