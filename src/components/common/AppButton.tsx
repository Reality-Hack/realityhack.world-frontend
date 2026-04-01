type AppButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function AppButton({ children, onClick, disabled, className }: AppButtonProps) {
  return (
    <button className={`flex flex-row px-3 text-sm font-medium text-white bg-[#40337F] rounded hover:opacity-90 py-4 justify-center items-center h-10 min-w-32 md:min-w-40 ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}