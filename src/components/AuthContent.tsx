'use client';

import Nav from '@/components/Nav';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from './Loader';
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

  const navRef = useRef<HTMLDivElement>(null);

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
    if (status != 'loading') {
      setTimeout(() => {
        setLoaded(true);
      }, 2000);
      return;
    }
  }, [status]);

  useEffect(() => {
    if (!session && pathname !== '/apply' && pathname !== '/signin') {
      router.replace('/apply');
      return;
    }

    if (session && (pathname === '/apply' || pathname === '/signin')) {
      router.replace('/');
    }

    if (status === 'loading') return;
  }, [session, status]);

  useEffect(() => {
    if (session) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [session]);

  return (
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
  );
};

export default AuthContent;
