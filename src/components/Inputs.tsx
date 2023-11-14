'use client';
import { form_data } from '@/application_form_types';
import React, { useState, useRef, useEffect } from 'react';

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
      if (value.trim().length < 3)
        return 'Input should be at least 3 characters.';
      break;
    case 'url':
      if (value.trim().length < 3)
        return 'Input should be at least 3 characters.';

      // Regex for URL validation
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (!urlPattern.test(value)) return 'Invalid URL.';
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
  other?: boolean;
  children?: React.ReactNode;
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
  other = false,
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

  let style = `h-8 placeholder:transition-all transition-all border-[1px] bg-white px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 '
  `;

  if (other === true) {
    style += ' w-[160px] ';
  } else {
    style += ' w-full ';
  }

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
        autoComplete="off"
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
    'mt-4 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 ';
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

export const SelectInput: React.FC<{
  name: string;
  placeholder: string;
  options: { value: string; display_name: string }[];
  value: string;
  onChange: (
    value: string[],
    name: string,
    options: { value: string; display_name: string }[]
  ) => void;

  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
  required?: boolean;
}> = ({
  name,
  placeholder,
  options,
  value,
  onChange,
  onBlur,
  error,
  valid = true,
  children,
  required
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [optionClicked, setOptionClicked] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');
  const activeOptionRef = useRef<HTMLDivElement>(null);

  const validateInput = () => {
    const isValid = options.some(option => option.display_name === inputValue);
    if (!isValid) {
      setValidationError('Invalid value');
    } else {
      setValidationError('');
    }
  };

  const manualBlur = () => {
    const syntheticEvent = {
      target: { name, value: inputValue, tagName: name, type: 'blur' },
      currentTarget: { name, value: inputValue }
    };

    if (onBlur) {
      onBlur(syntheticEvent as React.FocusEvent<HTMLInputElement>);
    }
  };

  useEffect(() => {
    if (isOptionsVisible && activeOptionRef.current) {
      activeOptionRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest'
      });
    }
  }, [activeIndex, isOptionsVisible]);

  useEffect(() => {
    if (options) {
      setFilteredOptions(
        options.filter(
          option =>
            option?.display_name
              ?.toLowerCase()
              ?.includes(String(inputValue).toLowerCase())
        )
      );
    }
  }, [inputValue, options]);

  useEffect(() => {
    if (inputValue === optionClicked) {
      manualBlur();
    }
  }, [inputValue, optionClicked]);

  const setVal = (val: string) => {
    setInputValue(val);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prevIndex => Math.max(0, prevIndex - 1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prevIndex =>
          Math.min(filteredOptions.length - 1, prevIndex + 1)
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[activeIndex]) {
          handleOptionClick(filteredOptions[activeIndex]);
          setIsOptionsVisible(false);
        }
        break;
      default:
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOptionsVisible(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateInput();
    if (onBlur) onBlur(e);
    setIsFocused(false);
    setIsOptionsVisible(false);
    setActiveIndex(0);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOptionClick = (option: {
    value: string;
    display_name: string;
  }) => {
    onChange([option.value], name, options);
    setOptionClicked(option.value);
    setVal(option.value);
    setInputValue(option.display_name);
    setIsOptionsVisible(false);
    setValidationError('');
  };

  let style =
    'h-8 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 ';

  if (isFocused) {
    style +=
      'text-themelight border-themePrimary shadow-themeActive border-opacity-100 ';
  } else if (!valid || error || validationError) {
    style +=
      'text-themeSecondary placeholder-themeSecondary border-themeSecondary shadow-themeSecondary border-opacity-100 ';
  } else {
    style += 'text-themelight border-gray-300 ';
  }

  return (
    <div className="relative mb-6">
      <p>{children}</p>
      <form autoComplete="off">
        <input
          value={inputValue}
          name={name}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className={style}
          autoComplete="off"
        />
      </form>
      {isOptionsVisible && (
        <div
          className={`transition-all absolute z-20 w-full bg-white border border-gray-300 rounded-lg ${
            filteredOptions.length >= 0 ? 'shadow-lg' : ''
          } top-full max-h-[216px] overflow-auto`}
        >
          {filteredOptions.map((option, index) => (
            <div
              ref={index === activeIndex ? activeOptionRef : null}
              key={index}
              onMouseDown={() => handleOptionClick(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                index === activeIndex ? 'bg-gray-200' : ''
              }`}
            >
              <p className="text-sm">{option.display_name}</p>
            </div>
          ))}
        </div>
      )}
      {error ? (
        <p className="absolute ml-1 text-xs text-themeSecondary">{error}</p>
      ) : validationError ? (
        <p className="absolute ml-1 text-xs text-themeSecondary">
          {validationError}
        </p>
      ) : null}
    </div>
  );
};

export const CheckboxInput: React.FC<{
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
}> = ({ name, value, checked, onChange, onBlur, label, error }) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) onBlur(e);
  };

  return (
    <div className="mb-2">
      <label>
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="px-3 py-3 mr-2 bg-white outline-none accent-themePrimary rounded-xl "
          onBlur={handleBlur}
        />
        {label}
      </label>
      {error && <p className="ml-1 text-xs text-themeSecondary">{error}</p>}
    </div>
  );
};

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
        className="mr-2 text-black accent-themePrimary rounded-xl w-fit"
      />
      {label}
    </label>
  </div>
);
