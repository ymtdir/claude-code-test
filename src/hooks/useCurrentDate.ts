import { useState, useEffect } from 'react';

/**
 * 現在の日付情報を提供するカスタムフック
 */
export const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // 毎分更新（必要に応じて調整可能）
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const day = currentDate.getDay();

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const dayName = dayNames[day];

  // 週の開始日と終了日を計算
  const weekStart = new Date(currentDate);
  weekStart.setDate(date - day);
  const weekEnd = new Date(currentDate);
  weekEnd.setDate(date - day + 6);

  return {
    currentDate,
    year,
    month,
    date,
    day,
    dayName,
    formattedMonth: `${year}年${month}月`,
    formattedDate: `${year}年${month}月${date}日`,
    formattedDateWithDay: `${year}年${month}月${date}日（${dayName}）`,
    weekRange: `${year}年${month}月${weekStart.getDate()}日 - ${
      weekEnd.getMonth() + 1
    }月${weekEnd.getDate()}日`,
  };
};
