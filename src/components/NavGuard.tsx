'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect } from 'react';
import useNavigationAccess from '@/hooks/useNavigationAccess';
import { useAuth } from '@/contexts/AuthContext';

interface NavGuardProviderProps {
  children: ReactNode;
}

export const NavGuardProvider = ({ children }: NavGuardProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { availableRoutes } = useNavigationAccess();
  const { session } = useAuth();

  const canAccessRoute = useCallback((pathname: string): boolean => {
    const publicRoutes = ['/apply', '/signin', '/rsvp'];
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    if (session && isPublicRoute) {
      console.warn(`${pathname} isPublicRoute: ${isPublicRoute} ${session ? 'has session' : 'no session'}`);
      router.replace('/');
      return false;
    }

    if (!session && !isPublicRoute) {
      console.warn(`${pathname} not public and no session, redirecting to signin`);
      router.replace('/signin');
      return false;
    }

    if (session && !isPublicRoute) {
      const hasAccess = availableRoutes.some(route => {
        if (route === '/') {
          return pathname === '/';
        }
        return pathname.startsWith(route);
      });
      if (!hasAccess) {
        console.warn(`Route ${pathname} not accessible, redirecting to home`);
        router.replace('/');
        return false;
      }
      return true;
    }
    return true;
  }, [pathname, session]);

  useEffect(() => {
    if (!canAccessRoute(pathname)) {
      router.replace('/');
    }
  }, [pathname, canAccessRoute]);

  return <>{children}</>;
};

