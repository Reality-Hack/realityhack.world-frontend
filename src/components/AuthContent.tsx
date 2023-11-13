'use client';

import { ReactNode, useEffect } from 'react';
import Nav from '@/components/Nav';
import AuthStatus from './AuthStatus';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Loader from './Loader';

interface RootLayoutProps {
  children: ReactNode;
}

const AuthContent: React.FC<RootLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!session && pathname != '/apply' && pathname != '/signin')
      router.replace('/apply');
  }, []);

  return (
    <>
      {session && !loading ? (
        <div className="flex flex-row">
          <div className="min-w-[288px] h-screen p-3 bg-[#ffffff]">
            <h2 className="text-3xl">RH2024</h2>
            <AuthStatus />
            <hr />
            <Nav />
          </div>
          <div className="w-full h-full p-3 bg-[#ffffff]">{children}</div>
        </div>
      ) : (
        <main>
          {pathname != '/apply' && pathname != '/signin' ? (
            <Loader />
          ) : (
            children
          )}
        </main>
      )}
    </>
  );
};

export default AuthContent;
