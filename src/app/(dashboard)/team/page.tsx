'use client';
import { useSession } from 'next-auth/react';

export default function Team() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      <>
        <h1>Teams</h1>
      </>
    </div>
  );
}
