'use client';
import { useSession } from 'next-auth/react';

export default function Help() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      <>
        <h1>Help Queue</h1>
      </>
    </div>
  );
}
