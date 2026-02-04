'use client';

import { EventParticipantsProvider } from '@/contexts/EventParticipantsContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <EventParticipantsProvider>
      {children}
    </EventParticipantsProvider>
  );
}
