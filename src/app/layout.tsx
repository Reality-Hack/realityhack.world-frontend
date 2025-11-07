import AuthContent from '@/components/AuthContent';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';
import SessionProviderWrapper from './utils/SessionProviderWrapper';
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'Reality Hack at MIT 2026',
  description: 'Reality Hack at MIT 2026'
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <SessionProviderWrapper>
      <link rel="shortcut icon" href="/images/favicon.ico" />
      <html lang="en">
        <body className={inter.className}>
          <Toaster position="top-left" />
          <AuthContent>{children}</AuthContent>
        </body>
      </html>
    </SessionProviderWrapper>
  );
};

export default RootLayout;
