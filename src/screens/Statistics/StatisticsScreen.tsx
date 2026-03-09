import React from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Grid } from '../../components/ui/Grid';
import { Progress } from '../../components/ui/Progress';

/**
 * 統計画面
 */
export const StatisticsScreen: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h1" style={{ marginBottom: '24px' }}>
        統計
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              本日の進捗
            </Typography>
            <Progress value={75} />
            <Typography variant="body1" style={{ marginTop: '12px' }}>
              完了: 15 / 20 タスク
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              今週の進捗
            </Typography>
            <Progress value={60} />
            <Typography variant="body1" style={{ marginTop: '12px' }}>
              完了: 60 / 100 タスク
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              今月の進捗
            </Typography>
            <Progress value={45} />
            <Typography variant="body1" style={{ marginTop: '12px' }}>
              完了: 180 / 400 タスク
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Typography variant="h2" style={{ marginBottom: '20px' }}>
              週間トレンド
            </Typography>
            <div
              style={{
                height: '300px',
                background: '#f9f9f9',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="secondary">
                グラフがここに表示されます
              </Typography>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              カテゴリ別統計
            </Typography>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div>
                <Typography variant="body2" color="secondary">
                  仕事
                </Typography>
                <Progress value={80} />
              </div>
              <div>
                <Typography variant="body2" color="secondary">
                  個人
                </Typography>
                <Progress value={65} />
              </div>
              <div>
                <Typography variant="body2" color="secondary">
                  学習
                </Typography>
                <Progress value={90} />
              </div>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              達成率トップ5
            </Typography>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {[
                { rank: 1, title: 'プロジェクトA', rate: 95 },
                { rank: 2, title: '日次レポート', rate: 92 },
                { rank: 3, title: 'ミーティング準備', rate: 88 },
                { rank: 4, title: 'メール返信', rate: 85 },
                { rank: 5, title: '資料作成', rate: 82 },
              ].map((item) => (
                <div
                  key={item.rank}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <Typography variant="h4" style={{ minWidth: '30px' }}>
                    {item.rank}
                  </Typography>
                  <Typography variant="body2" style={{ flex: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {item.rate}%
                  </Typography>
                </div>
              ))}
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
