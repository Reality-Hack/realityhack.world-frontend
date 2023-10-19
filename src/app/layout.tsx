
import './globals.css'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import AuthStatus from '@/components/AuthStatus'
import { ReactNode } from 'react';
import SessionProviderWrapper from './utils/SessionProviderWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RH2024',
  description: 'hackathon portal',
}

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
      <SessionProviderWrapper>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex flex-row">
            <div className="min-w-[288px] h-screen p-3 bg-[#f8f7ff]">
              <h2 className="text-3xl">RH2024</h2>
                <AuthStatus />
              <hr />
                <Nav />
            </div>
            <div className="w-full h-full p-3 bg-[#ffffff]">{children}</div>
          </div>
        </body>
      </html>
      </SessionProviderWrapper>
  )
}

export default RootLayout;
