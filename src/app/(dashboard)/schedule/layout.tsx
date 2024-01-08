'use client';
import { Tab } from '@/components/Tab';
import { usePathname } from 'next/navigation';

export default function ApplicationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="p-6 pt-8 pl-2">
      <h1 className="text-3xl">Applications</h1>
      <div className="py-4">
        <div className="pb-2">
          <Tab
            href="/schedule/MasterSchedule"
            isSelected={pathname === '/schedule/MasterSchedule'}
            title="Schedule"
          />
          <Tab
            href="/schedule/MySchedule"
            isSelected={pathname === '/schedule/MySchedule'}
            title="My Schedule"
          />
          
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}
