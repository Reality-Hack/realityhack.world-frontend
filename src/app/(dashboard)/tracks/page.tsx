'use client';
import { useSession } from '@/auth/client';

export default function Tracks() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      <>
        <h1>Tracks</h1>
      </>
    </div>
  );
}
