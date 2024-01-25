import { Select } from 'antd';

export interface Option {
  value: string;
  label: string | JSX.Element;
  searchLabel?: string | null;
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
  const filterOptions = (input: any, option: any) => {
    let labelContent;

    if (
      option.label &&
      typeof option.label === 'object' &&
      option.label.props
    ) {
      labelContent = option.label.props.children.join('');
    } else {
      labelContent = option.label;
    }

    return labelContent.toLowerCase().includes(input.toLowerCase());
  };

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
          filterOption={filterOptions}
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
