import {
  CustomSelectBase,
  type CustomSelectSharedProps,
  type Option,
} from '@/components/CustomSelectBase';

export type { Option };
export { CustomMultiSelect, type CustomMultiSelectProps } from '@/components/CustomMultiSelect';

export interface CustomSelectProps extends CustomSelectSharedProps {
  value: string;
  onChange: (value: string) => void;
  mode?: 'multiple' | 'tags' | undefined;
}

export default function CustomSelect({
  value,
  onChange,
  mode,
  ...rest
}: CustomSelectProps): JSX.Element {
  const handleChange = (next: string | string[]): void => {
    if (Array.isArray(next)) {
      onChange(next[0] ?? '');
    } else {
      onChange(next);
    }
  };

  return (
    <CustomSelectBase {...rest} mode={mode} value={value} onChange={handleChange} />
  );
}
