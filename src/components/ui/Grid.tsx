import React from 'react';

interface GridProps {
  container?: boolean;
  item?: boolean;
  spacing?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  container = false,
  item = false,
  spacing = 0,
  xs,
  md,
  children,
  style,
  className,
}) => {
  const containerStyles: React.CSSProperties = container
    ? {
        display: 'grid',
        gap: spacing ? `${spacing * 8}px` : 0,
        gridTemplateColumns: 'repeat(12, 1fr)',
      }
    : {};

  const itemStyles: React.CSSProperties = item
    ? {
        gridColumn: `span ${md || xs || 12}`,
      }
    : {};

  return (
    <div
      className={className}
      style={{
        ...containerStyles,
        ...itemStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
