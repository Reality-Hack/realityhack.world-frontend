'use client';

import { ReactNode } from 'react';
import Nav from '@/components/Nav';
import AuthStatus from './AuthStatus';
import { useSession } from 'next-auth/react';

interface RootLayoutProps {
  children: ReactNode;
}

const AuthContent: React.FC<RootLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <>
      {session && !loading ? (
        <div className="flex flex-row">
          <div className="min-w-[288px] h-screen p-3 bg-[#f8f7ff]">
            <h2 className="text-3xl">RH2024</h2>
            <AuthStatus />
            <hr />
            <Nav />
          </div>
          <div className="w-full h-full p-3 bg-[#ffffff]">{children}</div>
        </div>
      ) : (
        <div className="flex flex-row">
          <div className="flex-grow bg-[#ffffff]">{children}</div>
        </div>
      )}
    </>
  );
};

export default AuthContent;
