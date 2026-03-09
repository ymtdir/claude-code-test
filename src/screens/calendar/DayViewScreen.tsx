import React from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useCurrentDate } from '../../hooks/useCurrentDate';

/**
 * 日表示画面
 */
export const DayViewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { formattedDateWithDay } = useCurrentDate();

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
        <Typography variant="h1">日表示</Typography>
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
          <Button variant="outlined">前日</Button>
          <Typography variant="h2">{formattedDateWithDay}</Typography>
          <Button variant="outlined">翌日</Button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            gap: '0',
            minHeight: '600px',
          }}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  padding: '12px',
                  textAlign: 'right',
                  borderTop: '1px solid #e0e0e0',
                  background: '#f9f9f9',
                  fontWeight: 'bold',
                }}
              >
                {i.toString().padStart(2, '0')}:00
              </div>
              <div
                style={{
                  padding: '12px',
                  borderTop: '1px solid #e0e0e0',
                  borderLeft: '1px solid #e0e0e0',
                  minHeight: '50px',
                  background: 'white',
                }}
              >
                {i === 9 && (
                  <Card style={{ background: '#e3f2fd', padding: '8px' }}>
                    <Typography variant="body2">サンプルタスク</Typography>
                  </Card>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
};
