'use client';
import { useSession } from 'next-auth/react';

export default function Resources() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      <>
        <h1>Resources</h1>
      </>
    </div>
  );
}
