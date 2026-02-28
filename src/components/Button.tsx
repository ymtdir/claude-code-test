import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({
  variant = 'primary',
  children,
  ...props
}: ButtonProps) {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button className={className} type="button" {...props}>
      {children}
    </button>
  );
}
