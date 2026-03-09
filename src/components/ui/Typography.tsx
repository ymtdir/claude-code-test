import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'inherit';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'inherit',
  children,
  style,
  className,
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    h1: { fontSize: '32px', fontWeight: 'bold', lineHeight: 1.2 },
    h2: { fontSize: '24px', fontWeight: 'bold', lineHeight: 1.3 },
    h3: { fontSize: '20px', fontWeight: '600', lineHeight: 1.4 },
    h4: { fontSize: '18px', fontWeight: '600', lineHeight: 1.5 },
    body1: { fontSize: '16px', lineHeight: 1.5 },
    body2: { fontSize: '14px', lineHeight: 1.5 },
    caption: { fontSize: '12px', lineHeight: 1.4 },
  };

  const colorStyles: Record<string, string> = {
    primary: '#1976d2',
    secondary: '#666',
    error: '#d32f2f',
    success: '#2e7d32',
    inherit: 'inherit',
  };

  const Component = variant.startsWith('h')
    ? (variant as 'h1' | 'h2' | 'h3' | 'h4')
    : 'p';

  return (
    <Component
      className={className}
      style={{
        ...variantStyles[variant],
        color: colorStyles[color],
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};
