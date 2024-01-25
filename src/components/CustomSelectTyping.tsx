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
  width?: string;
  height?:string;
}

export default function CustomSelectTyping({
  label,
  options,
  value,
  onChange,
  disabled,
  width,
  
}: CustomSelectProps) {
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
