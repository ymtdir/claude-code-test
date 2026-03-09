import React from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useCurrentDate } from '../../hooks/useCurrentDate';

/**
 * 週表示画面
 */
export const WeekViewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { weekRange, date } = useCurrentDate();

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '16px',
        }}
      >
        <Button onClick={() => navigate('/calendar')} variant="outlined">
          戻る
        </Button>
        <Typography variant="h1">週表示</Typography>
      </div>

      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Button variant="outlined">前週</Button>
          <Typography variant="h2">{weekRange}</Typography>
          <Button variant="outlined">翌週</Button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            minHeight: '400px',
            padding: '20px',
            background: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => {
            const weekDate = new Date();
            weekDate.setDate(date - weekDate.getDay() + index);
            return (
              <div key={day} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {day}
                </div>
                <div style={{ fontSize: '20px', marginBottom: '16px' }}>
                  {weekDate.getDate()}
                </div>
                <div
                  style={{
                    minHeight: '300px',
                    background: 'white',
                    borderRadius: '4px',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography color="secondary" variant="body2">
                    タスク
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
