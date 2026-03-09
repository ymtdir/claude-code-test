import React from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * 週表示画面
 */
export const WeekViewScreen: React.FC = () => {
  const navigate = useNavigate();

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
          <Typography variant="h2">2026年3月9日 - 3月15日</Typography>
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
          {[
            { day: '日', date: '9' },
            { day: '月', date: '10' },
            { day: '火', date: '11' },
            { day: '水', date: '12' },
            { day: '木', date: '13' },
            { day: '金', date: '14' },
            { day: '土', date: '15' },
          ].map((item) => (
            <div key={item.date} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {item.day}
              </div>
              <div style={{ fontSize: '20px', marginBottom: '16px' }}>
                {item.date}
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
          ))}
        </div>
      </Card>
    </div>
  );
};
