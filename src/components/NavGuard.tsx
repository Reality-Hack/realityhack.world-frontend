import { useAppNavigate, useAppPathname } from '@/routing';
import { ReactNode, useEffect } from 'react';
import useRouteAccess from '@/hooks/useRouteAccess';

interface NavGuardProviderProps {
  children: ReactNode;
}

/**
 * Redirects away from routes the current user cannot reach. RouteAccessGate
 * is what stops the denied page from rendering in the meantime.
 */
export const NavGuardProvider = ({ children }: NavGuardProviderProps) => {
  const router = useAppNavigate();
  const pathname = useAppPathname();
  const { redirectTo, reason } = useRouteAccess();

  useEffect(() => {
    if (!redirectTo || redirectTo === pathname) return;
    console.warn(`Route ${pathname} denied (${reason}), redirecting to ${redirectTo}`);
    router.replace(redirectTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, redirectTo]);

  return <>{children}</>;
};
