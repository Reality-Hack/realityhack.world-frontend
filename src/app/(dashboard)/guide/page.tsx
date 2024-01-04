'use client';
import { useSession } from 'next-auth/react';

export default function Guide() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      <>
        <h1>Event Guide</h1>
      </>
    </div>
  );
}
