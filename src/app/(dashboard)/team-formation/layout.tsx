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
            href="/team-formation/hackers-met"
            isSelected={pathname === '/team-formation/hackers-met'}
            title="Hacker's I've Met"
          />
          <Tab
            href="/team-formation/interests"
            isSelected={pathname === '/team-formation/interests'}
            title="My Interests"
          />
          {isPastDeadline && <Tab
            href="/team-formation/round-one"
            isSelected={pathname === '/team-formation/round-one'}
            title="Team Members - Round 1"
          />}
          {isPastDeadline && <Tab
            href="/team-formation/round-two"
            isSelected={pathname === '/team-formation/round-two'}
            title="Team Members - Round 2"
          />}
          {isPastDeadline && <Tab
            href="/team-formation/round-three"
            isSelected={pathname === '/team-formation/round-three'}
            title="Team Members - Round 3"
          />}
          {isPastDeadline && <Tab
            href="/team-formation/final-team"
            isSelected={pathname === '/team-formation/final-team'}
            title="Final Team"
          />}
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}
