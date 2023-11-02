import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import SessionProviderWrapper from './utils/SessionProviderWrapper';
import AuthContent from '@/components/AuthContent';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'RH2024',
  description: 'hackathon portal'
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <SessionProviderWrapper>
      <html lang="en">
        <body className={inter.className}>
          <AuthContent>{children}</AuthContent>
        </body>
      </html>
    </SessionProviderWrapper>
  );
};

export default RootLayout;
