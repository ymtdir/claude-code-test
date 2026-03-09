import React from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Grid } from '../../components/ui/Grid';
import { useNavigate } from 'react-router-dom';

/**
 * カレンダーメイン画面
 */
export const CalendarScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h1" style={{ marginBottom: '24px' }}>
        カレンダー
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <Typography variant="h2" style={{ marginBottom: '16px' }}>
              2026年3月
            </Typography>
            <div
              style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                minHeight: '400px',
              }}
            >
              <Typography color="secondary">
                カレンダーウィジェットがここに表示されます
              </Typography>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              ビューオプション
            </Typography>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Button onClick={() => navigate('/calendar/month')} fullWidth>
                月表示
              </Button>
              <Button
                onClick={() => navigate('/calendar/week')}
                variant="outlined"
                fullWidth
              >
                週表示
              </Button>
              <Button
                onClick={() => navigate('/calendar/day')}
                variant="outlined"
                fullWidth
              >
                日表示
              </Button>
            </div>
          </Card>

          <Card style={{ marginTop: '16px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              今日のタスク
            </Typography>
            <Typography color="secondary">
              タスクリストがここに表示されます
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
