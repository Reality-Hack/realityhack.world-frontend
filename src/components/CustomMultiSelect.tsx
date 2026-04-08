import {
  CustomSelectBase,
  type CustomSelectSharedProps,
  type Option,
} from '@/components/CustomSelectBase';

export type { Option };

export interface CustomMultiSelectProps extends CustomSelectSharedProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CustomMultiSelect({
  value,
  onChange,
  ...rest
}: CustomMultiSelectProps): JSX.Element {
  const handleChange = (next: string | string[]): void => {
    onChange(Array.isArray(next) ? next : [next]);
  };

  return (
    <CustomSelectBase
      {...rest}
      mode="multiple"
      value={value}
      onChange={handleChange}
    />
  );
}
