import React from 'react';

interface ProgressProps {
  value: number; // 0-100
  color?: string;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = '#1976d2',
  height = 8,
  style,
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: '#e0e0e0',
        borderRadius: `${height / 2}px`,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: `${clampedValue}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
};
