import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  collapsed: boolean;
  className?: string;
}

export default function LogoutButton({ collapsed, className }: LogoutButtonProps) {
  async function keycloakSessionLogOut(): Promise<void> {
    try {
      // Get the Keycloak logout URL
      const response = await fetch('/api/auth/logout', { method: 'GET' });
      const data = await response.json();
      
      // Sign out from NextAuth first
      await signOut({ redirect: false });
      
      // Then redirect to Keycloak to clear its session
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <button
    className={`w-20 px-2 py-1 font-bold text-white border rounded border-gray-50 ${className}`}
    onClick={() => {
      keycloakSessionLogOut()
    }}
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