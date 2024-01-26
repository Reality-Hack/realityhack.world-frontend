'use client';
import { Tab } from '@/components/Tab';
import { usePathname } from 'next/navigation';

export default function HardwareCheckoutLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="h-screen p-6 pt-8 pl-2">
      <h1 className="text-3xl">Hardware Checkout</h1>
      <div className="py-4">
        <div className="pb-2">
          <Tab
            href="/hardwareCheckout/requestHardware"
            isSelected={pathname === '/requestHardware'}
            title="Request Hardware"
          />
          <Tab
            href="/hardwareCheckout/requestedHardware"
            isSelected={pathname === '/requestedHardware'}
            title="Already Requested"
          />
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}
