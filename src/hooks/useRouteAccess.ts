import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppPathname } from '@/routing';
import { evaluateRouteAccess, type RouteAccessResult } from '@/lib/access/routeAccess';

/**
 * Whether the current path is reachable by the current user. Shared by
 * RouteAccessGate (which blocks the render) and NavGuard (which performs the
 * redirect), so the two can never disagree.
 */
export default function useRouteAccess(): RouteAccessResult {
  const { session, status, capabilities } = useAuth();
  const pathname = useAppPathname();

  return useMemo(
    () =>
      evaluateRouteAccess({
        path: pathname,
        hasSession: !!session,
        isAuthLoading: status === 'loading',
        capabilities,
      }),
    [pathname, session, status, capabilities],
  );
}
