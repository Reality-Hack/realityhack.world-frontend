'use client';
import { Tab } from '../../../components/Tab';
import { usePathname } from 'next/navigation';
import { HardwareProvider } from '@/contexts/HardwareContext';

export default function Hardware({ children }: { children: any }) {
  const pathname = usePathname();
  return (
    <main>
      <h1 className="text-4xl">
        {pathname == '/hardware/requested'
          ? 'Requested hardware'
          : 'Hardware requests'}
      </h1>
      <div className="py-4">
        <div className="pb-2">
          <Tab
            href="/hardware/request"
            isSelected={pathname == '/hardware/request'}
            title="Request hardware"
          ></Tab>
          <Tab
            href="/hardware/requested"
            isSelected={pathname == '/hardware/requested'}
            title="Your requested hardware"
          ></Tab>
        </div>
      </div>
      <HardwareProvider>
        {children}
      </HardwareProvider>
    </main>
  );
}
