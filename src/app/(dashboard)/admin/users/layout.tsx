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
      <h1 className="text-3xl">Users</h1>
      <div className="py-4">
        <div className="pb-2">
          <Tab
            href="/admin/users/participants"
            isSelected={pathname === '/admin/users/participants'}
            title="Participants"
          />
          <Tab
            href="/admin/users/mentors"
            isSelected={pathname === '/admin/users/mentors'}
            title="Mentors"
          />
          <Tab
            href="/admin/users/judges"
            isSelected={pathname === '/admin/users/judges'}
            title="Judges"
          />
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}
