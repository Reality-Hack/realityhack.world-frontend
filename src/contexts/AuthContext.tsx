import { useSession } from '@/auth/client';
import { useCallback, useMemo } from 'react';
import { useAppNavigate, useAppPathname, type AppNavigate } from '@/routing';
import { AttendeeDetail } from '@/types/models';
import { AuthSession } from '@/auth/types';
import {
  ReactNode,
  createContext,
  useContext,
} from 'react';
import { useMeRetrieve } from '@/types/endpoints';
import { Capability, RoleFlags, deriveCapabilities } from '@/lib/access/capabilities';
import { FEATURE_FLAGS } from '@/lib/access/featureFlags';

/**
 * Extends RoleFlags so the context is statically guaranteed to supply
 * everything deriveCapabilities consumes — widening the derivation's inputs
 * fails to compile here rather than drifting silently.
 */
interface AuthContextType extends RoleFlags {
  session: AuthSession | null;
  router: AppNavigate;
  pathname: string;
  user: AttendeeDetail | null;
  isLoading: boolean;
  isSponsor: boolean;
  isMentor: boolean;
  isParticipant: boolean;
  isJudge: boolean;
  isGuardian: boolean;
  isMedia: boolean;
  canSendRsvps: boolean;
  /** Roles × feature flags, resolved once. Drives nav, route guarding and in-page gating. */
  capabilities: ReadonlySet<Capability>;
  can: (capability: Capability) => boolean;
  status: 'authenticated' | 'loading' | 'unauthenticated'
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: session, status } = useSession();
  const router = useAppNavigate();
  const pathname = useAppPathname();
  const isAdmin = useMemo(() => status === 'authenticated' && session?.roles?.includes('admin'), [session, status])
  const isOrganizer = useMemo(() => status === 'authenticated' && session?.roles?.includes('organizer'), [session, status])
  const isGuardian = useMemo(() => status === 'authenticated' && session?.roles?.includes('guardian'), [session, status])
  const isVolunteer = useMemo(() => status === 'authenticated' && session?.roles?.includes('volunteer'), [session, status])
  const isMedia = useMemo(() => status === 'authenticated' && session?.roles?.includes('media'), [session, status])
  const isSponsor = useMemo(() => status === 'authenticated' && session?.roles?.includes('sponsor'), [session, status])
  const isMentor = useMemo(() => status === 'authenticated' && session?.roles?.includes('mentor'), [session, status])
  const isParticipant = useMemo(() => status === 'authenticated' && session?.roles?.includes('attendee'), [session, status])
  const isJudge = useMemo(() => status === 'authenticated' && session?.roles?.includes('judge'), [session, status])
  const canSendRsvps = useMemo(() => status === 'authenticated' && session?.roles?.includes('send-rsvps'), [session, status])

  const canAccessSponsor = isAdmin || isSponsor;
  const canAccessMentor = isAdmin || isMentor;
  const canAccessParticipant = isAdmin || isParticipant;

  const capabilities = useMemo(
    () =>
      deriveCapabilities(
        {
          isAdmin: isAdmin ?? false,
          isVolunteer: isVolunteer ?? false,
          isOrganizer: isOrganizer ?? false,
          canAccessSponsor: canAccessSponsor ?? false,
          canAccessMentor: canAccessMentor ?? false,
          canAccessParticipant: canAccessParticipant ?? false,
        },
        FEATURE_FLAGS,
      ),
    [
      isAdmin,
      isVolunteer,
      isOrganizer,
      canAccessSponsor,
      canAccessMentor,
      canAccessParticipant,
    ],
  );

  const can = useCallback(
    (capability: Capability) => capabilities.has(capability),
    [capabilities],
  );

  const { data: userData, isLoading: isLoadingUser } = useMeRetrieve({
    swr: {
      enabled: !!session?.access_token
    },
  });

  const isLoading = status === 'loading' || isLoadingUser;

  const contextValue: AuthContextType = {
    session,
    router,
    pathname,
    user: userData ?? null,
    isLoading,
    isAdmin: isAdmin ?? false,
    isSponsor: isSponsor ?? false,
    isMentor: isMentor ?? false,
    isParticipant: isParticipant ?? false,
    isJudge: isJudge ?? false,
    isOrganizer: isOrganizer ?? false,
    isGuardian: isGuardian ?? false,
    isVolunteer: isVolunteer ?? false,
    isMedia: isMedia ?? false,
    canAccessSponsor: canAccessSponsor ?? false,
    canAccessMentor: canAccessMentor ?? false,
    canAccessParticipant: canAccessParticipant ?? false,
    canSendRsvps: canSendRsvps ?? false,
    capabilities,
    can,
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
