'use client';
import { useSession } from 'next-auth/react';

export default function Workshops() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      <>
        <h1>Hello</h1>
      </>
    </div>
  );
}
