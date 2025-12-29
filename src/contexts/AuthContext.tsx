'use client';

import { getMe } from '@/app/api/attendee';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
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
  isLoading: boolean;
  isAdmin: boolean;
  isSponsor: boolean;
  isMentor: boolean;
  isParticipant: boolean;
  canAccessSponsor: boolean;
  canAccessMentor: boolean;
  canAccessParticipant: boolean;
  status: 'authenticated' | 'loading' | 'unauthenticated'
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
  const isAdmin = useMemo(() => status === 'authenticated' && session?.roles?.includes('admin'), [session, status])
  const isSponsor = useMemo(() => status === 'authenticated' && session?.roles?.includes('sponsor'), [session, status])
  const isMentor = useMemo(() => status === 'authenticated' && session?.roles?.includes('mentor'), [session, status])
  const isParticipant = useMemo(() => status === 'authenticated' && session?.roles?.includes('attendee'), [session, status])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const canAccessSponsor = isAdmin || isSponsor;
  const canAccessMentor = isAdmin || isMentor;
  const canAccessParticipant = isAdmin || isParticipant;

  useEffect(() => {
    if (session?.access_token && isLoading) {
      const fetchUser = async () => {
        try {
          const details = await getMe(session.access_token);
          setUser(details);
          setIsLoading(false);
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
    user,
    isLoading,
    isAdmin,
    isSponsor,
    isMentor,
    isParticipant,
    canAccessSponsor,
    canAccessMentor,
    canAccessParticipant,
    status
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
