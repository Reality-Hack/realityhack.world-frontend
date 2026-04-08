import { Select } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';

export interface Option {
  value: string;
  label: string | JSX.Element;
  searchLabel?: string | null;
}

export interface CustomSelectSharedProps {
  label: string;
  options: Option[];
  disabled?: boolean;
  search?: boolean;
  onSearch?: (value: string) => void;
  width?: string;
}

export interface CustomSelectBaseProps extends CustomSelectSharedProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  mode?: 'multiple' | 'tags' | undefined;
}

function filterOptions(input: string, option?: DefaultOptionType): boolean {
  if (!option?.label) return false;
  const raw = option.label;
  let labelContent: string;
  if (
    typeof raw === 'object' &&
    raw !== null &&
    'props' in raw &&
    (raw as { props?: { children?: unknown } }).props?.children !== undefined
  ) {
    const children = (raw as { props: { children: unknown } }).props.children;
    labelContent = Array.isArray(children) ? children.join('') : String(children);
  } else {
    labelContent = String(raw);
  }
  return labelContent.toLowerCase().includes(input.toLowerCase());
}

export function CustomSelectBase({
  label,
  options,
  value,
  onChange,
  disabled,
  search,
  onSearch,
  width,
  mode,
}: CustomSelectBaseProps): JSX.Element {
  return (
    <div>
      {search ? (
        <Select
          showSearch
          value={value}
          style={{ width: width || 250 }}
          size="middle"
          disabled={disabled}
          placeholder={label}
          onChange={onChange}
          onSearch={onSearch}
          filterOption={filterOptions}
          options={options}
          getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
          mode={mode}
        />
      ) : (
        <Select
          value={value}
          style={{ width: width || 180 }}
          size="middle"
          disabled={disabled}
          placeholder={label}
          onChange={onChange}
          options={options}
          getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
          mode={mode}
        />
      )}
    </div>
  );
}
