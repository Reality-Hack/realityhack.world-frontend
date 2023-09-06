'use client';
import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface SessionProviderWrapperProps {
  children: ReactNode;
}

const SessionProviderWrapper: React.FC<SessionProviderWrapperProps> = ({children}) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  );
}

export default SessionProviderWrapper;
