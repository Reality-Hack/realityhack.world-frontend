'use client';

import Nav from '@/components/Nav';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import AuthStatus from './AuthStatus';
import Loader from './Loader';

interface RootLayoutProps {
  children: ReactNode;
}

const AuthContent: React.FC<RootLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  return (
    <>
      {session ? (
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
        <main>{status === 'loading' ? <Loader /> : children}</main>
      )}
    </>
  );
};

export default AuthContent;
