import { useMemo } from 'react';

type AppButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'xs' | 'small' | 'medium' | 'large';
}

export default function AppButton({ children, onClick, disabled, className, size = 'medium' }: AppButtonProps) {
  const width = useMemo(() => {
    if (size === 'xs') {
      return 'w-24 md:w-32';
    }
    if (size === 'small') {
      return 'w-32 md:w-40';
    }
    if (size === 'medium') {
      return 'w-40 md:w-48';
    }
    return 'w-48 md:w-64';
  }, [size]);

  const height = useMemo(() => {
    if (size === 'xs') {
      return 'h-8';
    }
    if (size === 'small') {
      return 'h-10';
    } else if (size === 'medium') {
      return 'h-12';
    } else {
      return 'h-14';
    }
  }, [size]);

  return (
    <button className={`flex flex-row px-3 text-sm font-medium text-white bg-[#40337F] rounded hover:opacity-90 justify-center items-center ${height} ${width} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}