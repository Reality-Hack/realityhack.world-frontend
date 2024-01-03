'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { getMe } from '@/app/api/attendee';

interface AuthContextType {
  session: any;
  router: any;
  pathname: string;
  user: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        try {
          const details = await getMe(session.access_token);
          setUser(details);
        } catch (error) {
          console.error('Error fetching attendee details:', error);
        }
      };

      fetchUser();
    }
  }, [session, status]);

  const contextValue: AuthContextType = {
    session,
    router,
    pathname,
    user
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext) as AuthContextType;
