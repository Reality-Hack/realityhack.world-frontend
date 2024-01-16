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
  search?: boolean;
  onSearch?: (value: string) => void;
}

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  disabled,
  search,
  onSearch
}: CustomSelectProps) {
  return (
    <div>
      {search ? (
        <Select
          showSearch
          value={value}
          style={{ width: 250 }}
          size="small"
          disabled={disabled}
          placeholder={label}
          onChange={onChange}
          onSearch={onSearch}
          filterOption={(input, option: any) =>
            option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          options={options}
        />
      ) : (
        <Select
          value={value}
          style={{ width: 180 }}
          size="small"
          disabled={disabled}
          placeholder={label}
          onChange={onChange}
          options={options}
        />
      )}
    </div>
  );
}
