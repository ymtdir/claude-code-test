import React from 'react';

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  className,
}) => {
  const [isChecked, setIsChecked] = React.useState(
    checked !== undefined ? checked : defaultChecked
  );

  React.useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = () => {
    if (!disabled) {
      const newValue = !isChecked;
      setIsChecked(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div
      className={className}
      onClick={handleChange}
      style={{
        display: 'inline-block',
        width: '48px',
        height: '24px',
        backgroundColor: isChecked ? '#1976d2' : '#ccc',
        borderRadius: '12px',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.3s',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: isChecked ? '26px' : '2px',
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: 'left 0.3s',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </div>
  );
};
