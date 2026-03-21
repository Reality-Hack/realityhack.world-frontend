'use client';
import React, { ReactNode } from 'react';
import { AuthClientProvider } from '@/auth/client';

interface SessionProviderWrapperProps {
  children: ReactNode;
}

const SessionProviderWrapper: React.FC<SessionProviderWrapperProps> = ({
  children
}) => {
  return <AuthClientProvider>{children}</AuthClientProvider>;
};

export default SessionProviderWrapper;
