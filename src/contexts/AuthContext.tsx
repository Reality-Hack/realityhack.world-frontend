'use client';

import { getMe } from '@/app/api/attendee';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AttendeeDetail } from '@/types/models';
import {
  ReactNode,
  createContext,
  useContext,
} from 'react';
import { useMeRetrieve } from '@/types/endpoints';

interface AuthContextType {
  session: any;
  router: any;
  pathname: string;
  user: AttendeeDetail | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSponsor: boolean;
  isMentor: boolean;
  isParticipant: boolean;
  isJudge: boolean;
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useMemo(() => status === 'authenticated' && session?.roles?.includes('admin'), [session, status])
  const isSponsor = useMemo(() => status === 'authenticated' && session?.roles?.includes('sponsor'), [session, status])
  const isMentor = useMemo(() => status === 'authenticated' && session?.roles?.includes('mentor'), [session, status])
  const isParticipant = useMemo(() => status === 'authenticated' && session?.roles?.includes('attendee'), [session, status])
  const isJudge = useMemo(() => status === 'authenticated' && session?.roles?.includes('judge'), [session, status])

  const canAccessSponsor = isAdmin || isSponsor;
  const canAccessMentor = isAdmin || isMentor;
  const canAccessParticipant = isAdmin || isParticipant;

  const { data: userData, isLoading: isLoadingUser } = useMeRetrieve({
    swr: {
      enabled: !!session?.access_token
    },
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const isLoading = status === 'loading' || isLoadingUser;

  const contextValue: AuthContextType = {
    session,
    router,
    pathname,
    user: userData ?? null,
    isLoading,
    isAdmin,
    isSponsor,
    isMentor,
    isParticipant,
    isJudge,
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
