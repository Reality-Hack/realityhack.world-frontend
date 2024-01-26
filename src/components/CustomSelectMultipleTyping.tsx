import { Select } from 'antd';

export interface Option {
  value: string;
  label: string;
}

export interface CustomSelectMultipleProps {
  label: string;
  options: Option[];
  value: string[]; // Change the type to string[]
  onChange: (value: string[]) => void; // Change the type to (value: string[]) => void
  disabled?: boolean;
  width?: string;
  height?: string;
}

export default function CustomSelectMultipleTyping({
  label,
  options,
  value,
  onChange,
  disabled,
  width,
}: CustomSelectMultipleProps) {
  return (
    <Select
    showSearch
    style={{
      width: width || 200,
    }}
    placeholder={`Search to Select ${label}`}
    optionFilterProp="children"
    filterOption={(input, option) =>
      (String(option?.label).toLowerCase() ?? '').includes(String(input).toLowerCase())
    }
    filterSort={(optionA, optionB) =>
      (String(optionA?.label) ?? '').toLowerCase().localeCompare(String(optionB?.label))
    }
      mode='multiple'
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {options.map((option) => (
        <Select.Option key={option.value} value={option.value} label={option.label}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
}
