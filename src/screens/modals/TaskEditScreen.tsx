import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * タスク編集モーダル画面
 */
export const TaskEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  // 実際のアプリでは、taskIdを使ってタスクデータを取得
  const today = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('サンプルタスク');
  const [description, setDescription] = useState('このタスクは編集可能です');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('10:00');
  const [completed, setCompleted] = useState(false);

  const handleSave = () => {
    console.log('タスクを更新:', {
      taskId,
      title,
      description,
      date,
      time,
      completed,
    });
    navigate(-1);
  };

  const handleDelete = () => {
    if (window.confirm('このタスクを削除してもよろしいですか？')) {
      console.log('タスクを削除:', taskId);
      navigate(-1);
    }
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <Typography variant="h2">タスクを編集</Typography>
          <Typography variant="body2" color="secondary">
            ID: {taskId}
          </Typography>
        </div>

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
              ステータス
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="completed"
                checked={completed}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCompleted(e.target.checked)
                }
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor="completed" style={{ cursor: 'pointer' }}>
                完了済み
              </label>
            </div>
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
              justifyContent: 'space-between',
              marginTop: '16px',
              borderTop: '1px solid #e0e0e0',
              paddingTop: '16px',
            }}
          >
            <Button variant="danger" onClick={handleDelete}>
              削除
            </Button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outlined" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button variant="primary" onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
