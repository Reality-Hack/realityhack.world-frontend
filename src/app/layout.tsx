import AuthContent from '@/components/AuthContent';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';
import SessionProviderWrapper from './utils/SessionProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'MIT Reality Hack 2024',
  description: 'MIT Reality Hack 2024'
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <SessionProviderWrapper>
      <link rel="shortcut icon" href="/images/favicon.ico" />
      <html lang="en">
        <body className={inter.className}>
          <AuthContent>{children}</AuthContent>
        </body>
      </html>
    </SessionProviderWrapper>
  );
};

export default RootLayout;
