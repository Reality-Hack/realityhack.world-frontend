'use client';

import Nav from '@/components/Nav';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import Loader from './Loader';

interface RootLayoutProps {
  children: ReactNode;
}

const AuthContent: React.FC<RootLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('status', status);
    console.log('session', session);
  }, [status]);

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
