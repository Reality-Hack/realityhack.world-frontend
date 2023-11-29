'use client';

import Nav from '@/components/Nav';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from './Loader';
interface RootLayoutProps {
  children: ReactNode;
}

const AuthContent: React.FC<RootLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!session && pathname !== '/apply' && pathname !== '/signin') {
      router.replace('/apply');
      return;
    }

    if (session) {
      router.replace('/');
    }
  }, []);

  return (
    <>
      {session ? (
        <div className="flex flex-row h-screen overflow-hidden">
          <div className="h-screen">
            <Nav />
          </div>
          <div className="w-full h-full p-3">{children}</div>
        </div>
      ) : (
        <main>{status === 'loading' ? <Loader /> : children}</main>
      )}
    </>
  );
};

export default AuthContent;
