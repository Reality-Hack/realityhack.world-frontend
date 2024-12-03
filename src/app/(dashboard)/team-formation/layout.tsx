'use client';
import { Tab } from '@/components/Tab';
import { usePathname } from 'next/navigation';

export default function TeamFormationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const TEAM_FORMATION_STAGE = process.env.NEXT_PUBLIC_TEAM_FORMATION_STAGE;

  return (
    <div className="h-screen p-6 pt-8 pl-2">
      <h1 className="text-3xl">Team Formation</h1>
      <div className="py-4">
        <div className="pb-2 flex flex-wrap gap-2 md:flex-row flex-col">
          <Tab
            href="/team-formation/hackers-met"
            isSelected={pathname === '/team-formation/hackers-met'}
            title="Hackers I've Met"
          />
          <Tab
            href="/team-formation/interests"
            isSelected={pathname === '/team-formation/interests'}
            title="My Interests"
          />
          <Tab
            href="/team-formation/profile"
            isSelected={pathname === '/team-formation/profile'}
            title="My Reality Hack Profile"
          />
          {TEAM_FORMATION_STAGE === '1' && (
            <Tab
              href="/team-formation/round-one"
              isSelected={pathname === '/team-formation/round-one'}
              title="Destiny Team Round 1"
            />
          )}
          {TEAM_FORMATION_STAGE === '2' && (
            <Tab
              href="/team-formation/round-two"
              isSelected={pathname === '/team-formation/round-two'}
              title="Destiny Team Round 2"
            />
          )}
          {TEAM_FORMATION_STAGE === '3' && (
            <Tab
              href="/team-formation/round-three"
              isSelected={pathname === '/team-formation/round-three'}
              title="Destiny Team Round 3"
            />
          )}
          {TEAM_FORMATION_STAGE === '4' && (
            <Tab
              href="/team-formation/final-team"
              isSelected={pathname === '/team-formation/final-team'}
              title="Final Team"
            />
          )}
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}
