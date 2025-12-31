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
  const { session, status } = useAuth();

  const getRedirectPath = useCallback((path: string): string | null => {
    if (status === 'loading') return null;

    const publicRoutes = ['/apply', '/signin', '/rsvp', '/signout'];
    const isPublicRoute = publicRoutes.some(route => 
      path === route || path.startsWith(`${route}/`)
    );

    if (session && isPublicRoute) {
      console.warn(`${path} isPublicRoute: ${isPublicRoute} - redirecting to home because session exists`);
      return '/';
    }

    if (!session && !isPublicRoute) {
      console.warn(`${path} not public and no session, redirecting to signin`);
      return '/signin';
    }

    if (session && !isPublicRoute) {
      const hasAccess = availableRoutes.some(route => {
        if (route === '/') {
          return path === '/';
        }
        return path.startsWith(route);
      });
      if (!hasAccess) {
        console.warn(`Route ${path} not accessible, redirecting to home`);
        return '/';
      }
    }
    return null;
  }, [session, status, availableRoutes]);

  useEffect(() => {
    const redirectPath = getRedirectPath(pathname);
    if (redirectPath && redirectPath !== pathname) {
      router.replace(redirectPath);
    }
  }, [pathname, getRedirectPath, router]);

  return <>{children}</>;
};

