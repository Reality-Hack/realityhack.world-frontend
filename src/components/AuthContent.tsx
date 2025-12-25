'use client';

import Nav from '@/components/Nav';
import { signOut, useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from './Loader';
import { AuthProvider } from '@/hooks/AuthContext';
import useFeatureFlags from '../hooks/useFeaureFlags';
import { ErrorDisplay } from './ErrorDisplay';
import { AUTH_ERRORS, AUTH_ERROR_TYPES, AUTH_ERROR_TITLES } from '../constants/auth';

interface RootLayoutProps {
  children: ReactNode;
}

const AuthContent: React.FC<RootLayoutProps> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    loaded: boolean;
    error: string | null;
    authenticated: boolean;
  }>({ loaded: false, error: null, authenticated: false });
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const navRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.roles?.includes('admin');
  const isSponsor = session?.roles?.includes('sponsor');

  const checkAccess = useCallback(() => {
    const protectedRoutes = {
      admin: '/admin',
      sponsor: '/sponsor',
    };
    const publicRoutes = ['/apply', '/signin', '/rsvp'];

    if (pathname.startsWith(protectedRoutes.admin) && !isAdmin) {
      return session ? '/' : '/signin';
    }
  
    if (pathname.startsWith(protectedRoutes.sponsor) && !isSponsor) {
      return session ? '/' : '/signin';
    }
    
    if (session && publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )) {
      return '/';
    }
    
    if (!session && !publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )) {
      return '/signin';
    }
    
    return null;
  }, [session, pathname, isAdmin, isSponsor]);

  const checkScreenSize = () => {
    if (window.innerWidth > 640) {
      setNavOpen(false);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', (event: any) => {
      if (!navRef.current?.contains(event.target)) {
        setNavOpen(false);
      }
    });
  }, []);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.error === AUTH_ERROR_TYPES.REFRESH_TOKEN_ERROR) {
      signOut({ callbackUrl: '/signin', redirect: true });
      return;
    }

    if (session?.error) {
      setAuthState({ 
        loaded: true, 
        error: session?.error,
        authenticated: true
      });
      return;
    }

    const redirectUrl = checkAccess();
    if (redirectUrl) {
      router.replace(redirectUrl);
    }

    setTimeout(() => {
      setAuthState({ 
        loaded: true, 
        error: null, 
        authenticated: !!session 
      });
    }, 400);

  }, [session, status, pathname, checkAccess, router]);

  useEffect(() => {
    if (session) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [session, status]);

  if (authState.error) {
    const errorTitle = authState.error === AUTH_ERROR_TYPES.NO_CLIENT_ROLES 
      ? AUTH_ERROR_TITLES.NO_CLIENT_ROLES 
      : AUTH_ERROR_TITLES.REFRESH_TOKEN_ERROR;
      
    const errorMessage = authState.error === AUTH_ERROR_TYPES.NO_CLIENT_ROLES
      ? AUTH_ERRORS.NO_CLIENT_ROLES
      : AUTH_ERRORS.REFRESH_TOKEN_ERROR;

    return (
      <ErrorDisplay
        title={errorTitle}
        message={errorMessage}
        actionLabel="Get Involved"
        onAction={() => {
          window.location.href = 'https://www.realityhackatmit.com/';
        }}
      />
    );
  }

  return (
    <AuthProvider>
      {authState.loaded ? (
        <>
          {session ? (
            <div className="flex flex-row h-screen overflow-hidden">
              <div
                ref={navRef}
                className={`${collapsed ? 'w-[250px]' : 'w-[80px]'} sm:left-0 ${
                  !navOpen ? 'left-[-250px]' : 'left-0'
                } absolute sm:relative transition-all z-[1000]`}
              >
                <Nav
                  navOpen={navOpen}
                  setNavOpen={setNavOpen}
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </div>
              <div className="w-full h-screen p-3 pb-8 overflow-auto transition-all">
                <div className="px-4 items-center flex flex-row justify-between visible sm:hidden opacity-100 sm:opacity-0 h-[86px] w-full">
                  <button
                    className="w-8 h-8"
                    onClick={() => {
                      setCollapsed(true);
                      setNavOpen(!navOpen);
                    }}
                  >
                    <img
                      src="/icons/dashboard/hamburger-menu.svg"
                      alt="burga"
                      className="w-8 h-8"
                    />
                  </button>
                  <img
                    src="/icons/dashboard/logo.svg"
                    alt="burga"
                    className="w-10 h-10"
                  />
                </div>
                {children}
              </div>
            </div>
          ) : (
            <main>
              {!authState.loaded ? (
                <Loader />
              ) : (
                children
              )}
            </main>
          )}
        </>
      ) : (
        <Loader />
      )}
    </AuthProvider>
  );
};

export default AuthContent;
