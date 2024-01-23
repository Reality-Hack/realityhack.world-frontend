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
      <h1 className="text-3xl">RSVPs</h1>
      <div className="py-4">
        <div className="pb-2">
          <Tab
            href="/admin/rsvp/participants"
            isSelected={pathname === '/admin/rsvp/participants'}
            title="Participants"
          />
          <Tab
            href="/admin/rsvp/mentors"
            isSelected={pathname === '/admin/rsvp/mentors'}
            title="Mentors"
          />
          <Tab
            href="/admin/rsvp/judges"
            isSelected={pathname === '/admin/rsvp/judges'}
            title="Judges"
          />
          <Tab
            href="/admin/rsvp/volunteers"
            isSelected={pathname === '/admin/rsvp/volunteers'}
            title="Volunteers"
          />
          <Tab
            href="/admin/rsvp/organizers"
            isSelected={pathname === '/admin/rsvp/organizers'}
            title="Organizers"
          />
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}
