import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  value?: string | number;
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  placeholder,
  fullWidth = false,
  required = false,
  disabled = false,
  onChange,
  style,
  className,
}) => {
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {label}
          {required && <span style={{ color: '#d32f2f' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        onChange={onChange}
        className={className}
        style={{
          width: fullWidth ? '100%' : 'auto',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          transition: 'border-color 0.3s',
          ...style,
        }}
      />
    </div>
  );
};
