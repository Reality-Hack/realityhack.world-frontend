'use client';
import { Tab } from '../../../../components/Tab';
import { usePathname } from 'next/navigation';
import { HardwareProvider } from '@/contexts/HardwareContext';
import { useMemo } from 'react';

export default function Hardware({ children }: { children: any }) {
  const pathname = usePathname();
  const pageTitle = useMemo(() => {
    if (pathname == '/admin/hardware/request') {
      return 'Hardware requests';
    }
    if (pathname == '/admin/hardware/register') {
      return 'Register new hardware';
    }
    if (pathname == '/admin/hardware/checkout') {
      return 'Hardware checkout';
    }
    return 'Hardware';
  }, [pathname]);
  return (
    <HardwareProvider>
      <main>
        <h1 className="text-4xl">
          {pageTitle}
        </h1>
        <div className="py-4">
          <div className="pb-2">
            <Tab
              href="/admin/hardware/requests"
              isSelected={pathname == '/admin/hardware/requests'}
              title="All requests"
            ></Tab>
            <Tab
              href="/admin/hardware/checkout"
              isSelected={pathname == '/admin/hardware/checkout'}
              title="Checkout"
            ></Tab>
            <Tab
              href="/admin/hardware/register"
              isSelected={pathname == '/admin/hardware/register'}
              title="Register new hardware"
            ></Tab>
          </div>
        </div>
       {children}
      </main>
    </HardwareProvider>
  );
}
