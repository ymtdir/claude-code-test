import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ReminderSettings } from '../../components/ReminderSettings/ReminderSettings';
import { ReminderList } from '../../components/ReminderList/ReminderList';
import { selectTaskById } from '../../store/slices/tasksSlice';
import NotificationService from '../../services/NotificationService';
import { setNotificationPermission } from '../../store/slices/reminderSlice';

/**
 * リマインダー設定モーダル画面
 */
export const ReminderScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { taskId } = useParams<{ taskId: string }>();
  const [activeTab, setActiveTab] = useState<'settings' | 'list'>('settings');

  // Reduxからタスク情報を取得
  const task = useSelector(taskId ? selectTaskById(taskId) : () => undefined);

  // 初期化時に通知権限をチェック
  useEffect(() => {
    const permission = NotificationService.checkPermission();
    dispatch(setNotificationPermission(permission));
  }, [dispatch]);

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
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: '24px' }}>
          リマインダー管理
        </Typography>

        {/* タブ切り替え */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            borderBottom: '2px solid #e0e0e0',
          }}
        >
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom:
                activeTab === 'settings' ? '2px solid #667eea' : 'none',
              color: activeTab === 'settings' ? '#667eea' : '#666',
              fontWeight: activeTab === 'settings' ? 600 : 400,
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            新規設定
          </button>
          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'list' ? '2px solid #667eea' : 'none',
              color: activeTab === 'list' ? '#667eea' : '#666',
              fontWeight: activeTab === 'list' ? 600 : 400,
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            リマインダー一覧
          </button>
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'settings' && task && (
          <ReminderSettings
            taskId={task?.id || ''}
            taskTitle={task?.title}
            taskDate={task?.date}
            taskTime={task?.time}
          />
        )}

        {activeTab === 'list' && (
          <ReminderList
            filterTaskId={taskId}
            showInactive={true}
            onReminderClick={(reminder) => {
              console.log('Reminder clicked:', reminder);
              setActiveTab('settings');
            }}
          />
        )}

        {!task && taskId && (
          <Typography variant="body2" color="secondary">
            タスクが見つかりません: {taskId}
          </Typography>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
            borderTop: '1px solid #e0e0e0',
            paddingTop: '16px',
          }}
        >
          <Button variant="outlined" onClick={handleCancel}>
            閉じる
          </Button>
        </div>
      </Card>
    </div>
  );
};
