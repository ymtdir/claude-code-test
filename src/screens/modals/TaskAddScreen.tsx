import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

/**
 * タスク追加モーダル画面
 */
export const TaskAddScreen: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSave = () => {
    // タスクを保存する処理
    console.log('タスクを保存:', { title, description, date, time });
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
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: '24px' }}>
          新しいタスクを追加
        </Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="タスク名"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            placeholder="タスク名を入力"
            fullWidth
            required
          />

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              説明
            </label>
            <textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="タスクの詳細を入力"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <Input
              label="日付"
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              fullWidth
            />
            <Input
              label="時刻"
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
              カテゴリ
            </label>
            <select
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option>未分類</option>
              <option>仕事</option>
              <option>個人</option>
              <option>学習</option>
              <option>健康</option>
              <option>買い物</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              優先度
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outlined" size="small">
                低
              </Button>
              <Button variant="primary" size="small">
                中
              </Button>
              <Button variant="outlined" size="small">
                高
              </Button>
              <Button variant="outlined" size="small">
                緊急
              </Button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '16px',
            }}
          >
            <Button variant="outlined" onClick={handleCancel}>
              キャンセル
            </Button>
            <Button variant="primary" onClick={handleSave}>
              タスクを追加
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
