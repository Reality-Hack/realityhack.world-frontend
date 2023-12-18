'use client';
import { useSession } from 'next-auth/react';

export default function Settings() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      <>
        <h1>Settings</h1>
      </>
    </div>
  );
}
