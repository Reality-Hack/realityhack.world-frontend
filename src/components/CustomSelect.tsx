import { Select } from 'antd';

export interface Option {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  disabled
}: CustomSelectProps) {
  return (
    <Select
      value={value}
      style={{ width: 180 }}
      size="small"
      disabled={disabled}
      placeholder={label}
      onChange={onChange}
      options={options}
    />
  );
}
