'use client';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      {status === 'authenticated' && (
        <>
          <h1>Dashboard</h1>
        </>
      )}
    </div>
  );
}
