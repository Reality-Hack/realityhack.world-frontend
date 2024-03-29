'use client';

import Nav from '@/components/Nav';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from './Loader';
import { AuthProvider } from '@/hooks/AuthContext';
import useFeatureFlags from '../hooks/useFeaureFlags';
interface RootLayoutProps {
  children: ReactNode;
}

const AuthContent: React.FC<RootLayoutProps> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = session && (session as any).roles?.includes('admin');
  const isSponsor = session && (session as any).roles?.includes('sponsor');

  const navRef = useRef<HTMLDivElement>(null);

  const { areFeatureFlagsDefined } = useFeatureFlags();

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
    if (!areFeatureFlagsDefined) {
      setTimeout(() => {
        setLoaded(true);
      }, 400);
      return;
    }

    if (status === 'loading') return;

    setTimeout(() => {
      if (
        (session && status === 'authenticated') ||
        (!session && status === 'unauthenticated')
      ) {
        setLoaded(true);
      }
    }, 400);

    if (!isAdmin && pathname.startsWith('/admin')) {
      session ? router.replace('/') : router.replace('/signin');
      setTimeout(() => setLoaded(true), 400);
      return;
    }

    if (!isSponsor && pathname.startsWith('/sponsor')) {
      session ? router.replace('/') : router.replace('/signin');
      setTimeout(() => setLoaded(true), 400);
      return;
    }

    if (
      session &&
      (pathname === '/apply' ||
        pathname.startsWith('/apply/') ||
        pathname.startsWith('/rsvp/') ||
        pathname === '/signin')
    ) {
      router.replace('/');
      setTimeout(() => setLoaded(true), 400);
      return;
    }

    if (
      !session &&
      !pathname.startsWith('/apply/') &&
      pathname !== '/apply' &&
      pathname !== '/signin' &&
      !pathname.startsWith('/rsvp/')
    ) {
      router.replace('/signin');
      setTimeout(() => setLoaded(true), 400);
      return;
    }
  }, [session, status]);

  useEffect(() => {
    if (session) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [session, status]);

  return (
    <AuthProvider>
      {loaded ? (
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
            <main>{!loaded ? <Loader /> : children}</main>
          )}
        </>
      ) : (
        <Loader />
      )}
    </AuthProvider>
  );
};

export default AuthContent;
