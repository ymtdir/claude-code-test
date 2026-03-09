import React from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Grid } from '../../components/ui/Grid';

/**
 * 設定画面
 */
export const SettingsScreen: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h1" style={{ marginBottom: '24px' }}>
        設定
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h2" style={{ marginBottom: '20px' }}>
              プロフィール
            </Typography>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <Input label="名前" value="山田 太郎" fullWidth />
              <Input
                label="メールアドレス"
                type="email"
                value="taro.yamada@example.com"
                fullWidth
              />
              <Input
                label="電話番号"
                type="tel"
                value="090-1234-5678"
                fullWidth
              />
              <Button variant="primary">プロフィールを更新</Button>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h2" style={{ marginBottom: '20px' }}>
              通知設定
            </Typography>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>デイリーリマインダー</Typography>
                <Switch defaultChecked />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>タスク完了通知</Typography>
                <Switch defaultChecked />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>期限通知</Typography>
                <Switch defaultChecked />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>週次レポート</Typography>
                <Switch />
              </div>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h2" style={{ marginBottom: '20px' }}>
              表示設定
            </Typography>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <Typography variant="body2" style={{ marginBottom: '8px' }}>
                  テーマ
                </Typography>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outlined">ライト</Button>
                  <Button variant="primary">ダーク</Button>
                  <Button variant="outlined">自動</Button>
                </div>
              </div>
              <div>
                <Typography variant="body2" style={{ marginBottom: '8px' }}>
                  言語
                </Typography>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  <option>日本語</option>
                  <option>English</option>
                  <option>中文</option>
                </select>
              </div>
              <div>
                <Typography variant="body2" style={{ marginBottom: '8px' }}>
                  週の開始日
                </Typography>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  <option>日曜日</option>
                  <option>月曜日</option>
                </select>
              </div>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h2" style={{ marginBottom: '20px' }}>
              データ管理
            </Typography>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Button variant="outlined" fullWidth>
                データをエクスポート
              </Button>
              <Button variant="outlined" fullWidth>
                データをインポート
              </Button>
              <Button variant="outlined" fullWidth>
                バックアップを作成
              </Button>
              <Button variant="danger" fullWidth>
                すべてのデータを削除
              </Button>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Typography variant="h2" style={{ marginBottom: '20px' }}>
              アプリケーション情報
            </Typography>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <Typography variant="body2">バージョン: 1.0.0</Typography>
              <Typography variant="body2">
                最終更新日: {new Date().toLocaleDateString('ja-JP')}
              </Typography>
              <Typography variant="body2">ライセンス: MIT</Typography>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <Button variant="outlined">利用規約</Button>
                <Button variant="outlined">プライバシーポリシー</Button>
                <Button variant="outlined">お問い合わせ</Button>
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
