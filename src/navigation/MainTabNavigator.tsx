import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Typography } from '../components/ui/Typography';

/**
 * メインタブナビゲーター
 * React Router v6を使用したタブナビゲーション実装
 */
export const MainTabNavigator: React.FC = () => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      {/* メインコンテンツエリア */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>

      {/* タブバー */}
      <nav
        style={{
          display: 'flex',
          borderTop: '1px solid #e0e0e0',
          background: 'white',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <NavLink
          to="/calendar"
          style={({ isActive }) => ({
            flex: 1,
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive ? '#1976d2' : '#666',
            background: isActive ? '#f0f7ff' : 'transparent',
            borderTop: isActive ? '2px solid #1976d2' : '2px solid transparent',
            marginTop: '-2px',
            transition: 'all 0.3s ease',
          })}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
          <Typography variant="caption" style={{ marginTop: '4px' }}>
            カレンダー
          </Typography>
        </NavLink>

        <NavLink
          to="/statistics"
          style={({ isActive }) => ({
            flex: 1,
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive ? '#1976d2' : '#666',
            background: isActive ? '#f0f7ff' : 'transparent',
            borderTop: isActive ? '2px solid #1976d2' : '2px solid transparent',
            marginTop: '-2px',
            transition: 'all 0.3s ease',
          })}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <Typography variant="caption" style={{ marginTop: '4px' }}>
            統計
          </Typography>
        </NavLink>

        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            flex: 1,
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive ? '#1976d2' : '#666',
            background: isActive ? '#f0f7ff' : 'transparent',
            borderTop: isActive ? '2px solid #1976d2' : '2px solid transparent',
            marginTop: '-2px',
            transition: 'all 0.3s ease',
          })}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
          </svg>
          <Typography variant="caption" style={{ marginTop: '4px' }}>
            設定
          </Typography>
        </NavLink>
      </nav>
    </div>
  );
};
