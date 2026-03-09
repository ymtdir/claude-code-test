import React from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * 月表示画面
 */
export const MonthViewScreen: React.FC = () => {
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
        <Typography variant="h1">月表示</Typography>
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
          <Button variant="outlined">前月</Button>
          <Typography variant="h2">2026年3月</Typography>
          <Button variant="outlined">翌月</Button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            minHeight: '500px',
            padding: '20px',
            background: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                padding: '10px',
                borderBottom: '2px solid #e0e0e0',
              }}
            >
              {day}
            </div>
          ))}
          <Typography
            color="secondary"
            style={{
              gridColumn: 'span 7',
              textAlign: 'center',
              padding: '40px',
            }}
          >
            カレンダーグリッドがここに表示されます
          </Typography>
        </div>
      </Card>
    </div>
  );
};
