import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * リマインダー設定モーダル画面
 */
export const ReminderScreen: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const today = new Date().toISOString().split('T')[0];
  const [enabled, setEnabled] = useState(true);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('09:00');
  const [repeatType, setRepeatType] = useState('none');
  const [notification, setNotification] = useState(true);

  const handleSave = () => {
    console.log('リマインダーを設定:', {
      taskId,
      enabled,
      date,
      time,
      repeatType,
      notification,
    });
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <Card
        style={{
          maxWidth: '450px',
          width: '100%',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: '24px' }}>
          リマインダー設定
        </Typography>

        <Typography
          variant="body2"
          color="secondary"
          style={{ marginBottom: '20px' }}
        >
          タスクID: {taskId}
        </Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: '#f5f5f5',
              borderRadius: '8px',
            }}
          >
            <Typography variant="body1">リマインダーを有効化</Typography>
            <Switch
              checked={enabled}
              onChange={(checked) => setEnabled(checked)}
            />
          </div>

          {enabled && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <Input
                  label="通知日"
                  type="date"
                  value={date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDate(e.target.value)
                  }
                  fullWidth
                />
                <Input
                  label="通知時刻"
                  type="time"
                  value={time}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTime(e.target.value)
                  }
                  fullWidth
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                  }}
                >
                  繰り返し設定
                </label>
                <select
                  value={repeatType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setRepeatType(e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  <option value="none">繰り返しなし</option>
                  <option value="daily">毎日</option>
                  <option value="weekly">毎週</option>
                  <option value="monthly">毎月</option>
                  <option value="weekdays">平日のみ</option>
                  <option value="weekends">週末のみ</option>
                </select>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>プッシュ通知を送信</Typography>
                <Switch
                  checked={notification}
                  onChange={(checked) => setNotification(checked)}
                />
              </div>

              <Card style={{ background: '#e3f2fd' }}>
                <Typography variant="body2">
                  💡 ヒント:
                  リマインダーを設定すると、指定した時刻に通知が送信されます。
                  繰り返し設定を使用して、定期的なタスクのリマインダーを自動化できます。
                </Typography>
              </Card>
            </>
          )}

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '16px',
              borderTop: '1px solid #e0e0e0',
              paddingTop: '16px',
            }}
          >
            <Button variant="outlined" onClick={handleCancel}>
              キャンセル
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!enabled}>
              設定を保存
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
