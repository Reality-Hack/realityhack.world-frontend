'use client';

import { getMe } from '@/app/api/attendee';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

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
  const [meFetchedFlag, setMeFetchedFlag] = useState<boolean>(false);

  useEffect(() => {
    if (session && !meFetchedFlag) {
      const fetchUser = async () => {
        try {
          const details = await getMe(session.access_token);
          setUser(details);
          setMeFetchedFlag(true);
        } catch (error) {
          console.error('Error fetching attendee details:', error);
        }
      };

      fetchUser();
    }
  }, [session]);

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
