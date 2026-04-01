'use client';

import { EventParticipantsProvider } from '@/contexts/EventParticipantsContext';
import { SponsorsProvider } from '@/contexts/SponsorsContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SponsorsProvider>
      <EventParticipantsProvider>
        {children}
      </EventParticipantsProvider>
    </SponsorsProvider>
  );
}
