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
    <div className="h-screen p-6 pt-8 pl-2">
      <h1 className="text-3xl">Applications</h1>
      <div className="py-4">
        <div className="pb-2">
          <Tab
            href="/admin/applications/participants"
            isSelected={pathname === '/admin/applications/participants'}
            title="Participants"
          />
          <Tab
            href="/admin/applications/mentors"
            isSelected={pathname === '/admin/applications/mentors'}
            title="Mentors"
          />
          <Tab
            href="/admin/applications/judges"
            isSelected={pathname === '/admin/applications/judges'}
            title="Judges"
          />
          <Tab
            href="/admin/applications/volunteers"
            isSelected={pathname === '/admin/applications/volunteers'}
            title="Volunteers"
          />
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}
