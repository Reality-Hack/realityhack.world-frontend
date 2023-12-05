import { useEffect, useState } from 'react';

type DebouncedInputProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

/**
 * REALITYHACK Component
 *
 * input component designed originally for Table component, debounces output so onChange is delayed
 * useful if input value changes a intensive query, as it prevents too many updates by only calling on change after a set interval
 * extends input props except onChange
 * @props value for input, set as initialValue by default
 * @props onChange function to pass change to once timeout clears
 * @props debounce default is half a second, how much time to wait before calling onChange prop function
 * @props any input props except onChange can be added on
 * @returns an input that debounces changes
 */
export default function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      className="w-[436px] h-8 py-2 pl-2 text-sm border rounded-md dark:border-borderDark text dark:bg-inputDark"
      onChange={e => setValue(e.target.value)}
    ></input>
  );
}
