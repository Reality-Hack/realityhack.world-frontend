'use client';
import { Tab } from '@/components/Tab';
import { usePathname } from 'next/navigation';

export default function TeamFormationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Get the current date and time
  const currentDate = new Date();
  const deadlineDate = new Date('2024-01-27T10:59:00');

  // Check if the current date is past the deadline
  const isPastDeadline = currentDate > deadlineDate;
  
  return (
    <div className="h-screen p-6 pt-8 pl-2">
      <h1 className="text-3xl">Team Formation</h1>
      <div className="py-4">
        <div className="pb-2 flex flex-wrap gap-2">
          <Tab
            href="/teamFormation/hackersMet"
            isSelected={pathname === '/teamFormation/hackersMet'}
            title="Hacker's I've Met"
          />
          <Tab
            href="/teamFormation/interests"
            isSelected={pathname === '/teamFormation/interests'}
            title="My Interests"
          />
          {isPastDeadline && <Tab
            href="/teamFormation/roundOne"
            isSelected={pathname === '/teamFormation/roundOne'}
            title="Team Members - Round 1"
          />}
          {isPastDeadline && <Tab
            href="/teamFormation/roundTwo"
            isSelected={pathname === '/teamFormation/roundTwo'}
            title="Team Members - Round 2"
          />}
          {isPastDeadline && <Tab
            href="/teamFormation/roundThree"
            isSelected={pathname === '/teamFormation/roundThree'}
            title="Team Members - Round 3"
          />}
          {isPastDeadline && <Tab
            href="/teamFormation/finalTeam"
            isSelected={pathname === '/teamFormation/finalTeam'}
            title="Final Team"
          />}
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}
