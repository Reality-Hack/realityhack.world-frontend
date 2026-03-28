import { signOut } from '@/auth/client';

interface LogoutButtonProps {
  collapsed: boolean;
  className?: string;
}

export default function LogoutButton({ collapsed, className }: LogoutButtonProps) {
  return (
    <button
      className={`w-20 px-2 py-1 font-bold text-white border rounded border-gray-50 ${className}`}
      onClick={() => signOut()}
    >
      <span
        className={`font-normal whitespace-nowrap transition-all ${
          collapsed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Log out
      </span>
    </button>
  );
}
