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
  title: 'MIT Reality Hack 2025',
  description: 'MIT Reality Hack 2025'
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
