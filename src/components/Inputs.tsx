'use client';
import React, { useState } from 'react';

export enum FocusState {
  Focused,
  Blurred
}

export const validateField = (
  type: string,
  value: any,
  isRequired: boolean = false,
  checked: boolean = false
): string => {
  if (isRequired && (!value || (typeof value === 'string' && !value.trim())))
    return 'This field is required.';

  switch (type) {
    case 'email':
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(value)) return 'Invalid email format.';
      break;
    case 'text':
      if (value.trim().length < 3 && value.trim().length > 0)
        return 'input should be at least 3 characters.';
      break;
    case 'url':
      try {
        new URL(value);
      } catch (e) {
        return 'Invalid URL.';
      }
      break;
    case 'checkbox':
      if (isRequired && !checked) return 'This checkbox must be checked.';
      break;
    default:
      break;
  }
  return '';
};

export const TextInput: React.FC<{
  name: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  error?: string;
  valid?: boolean;
  required?: boolean;
  children: React.ReactNode;
}> = ({
  name,
  placeholder,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  valid = true,
  required = false,
  children
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  let style =
    'h-8 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 ';

  if (isFocused) {
    style +=
      'text-themelight border-themePrimary shadow-themeActive border-opacity-100 ';
  } else if (!valid) {
    style +=
      'text-themeSecondary placeholder-themeSecondary border-themeSecondary shadow-themeSecondary border-opacity-100 ';
  } else {
    style += 'text-themelight border-gray-300 ';
  }

  return (
    <div className="relative mb-6">
      <p>{children}</p>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        required={required}
        className={style}
      />
      {error && (
        <p className="absolute ml-1 text-xs text-themeSecondary">{error}</p>
      )}
    </div>
  );
};

export const TextAreaInput: React.FC<{
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  isFocused?: boolean;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
  rows?: number;
  cols?: number;
}> = ({
  name,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  valid = true,
  children,
  rows = 12,
  cols = 50
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  let style =
    'mt-4 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 ';
  if (isFocused) {
    style +=
      'text-themelight border-themePrimary shadow-themeActive border-opacity-100 ';
  } else if (!valid) {
    style +=
      'text-themeSecondary placeholder-themeSecondary border-themeSecondary shadow-themeSecondary border-opacity-100 ';
  } else {
    style += 'text-themelight border-gray-300 ';
  }

  return (
    <div className="relative mb-6">
      <p>{children}</p>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={style}
        rows={rows}
        cols={cols}
      ></textarea>
      {error && (
        <p className="absolute ml-1 text-xs text-themeSecondary">{error}</p>
      )}
    </div>
  );
};

export const CheckboxInput: React.FC<{
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
}> = ({ name, value, checked, onChange, label, error }) => (
  <div className="mb-2">
    <label>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      {label}
    </label>
    {error && <p className="ml-1 text-xs text-themeSecondary">{error}</p>}
  </div>
);

export const RadioInput: React.FC<{
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}> = ({ name, value, checked, onChange, label }) => (
  <div className="mb-2">
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      {label}
    </label>
  </div>
);
