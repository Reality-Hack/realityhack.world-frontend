'use client';
import { useSession } from '@/auth/client';

export default function Showcase() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      <>
        <h1>Showcase</h1>
      </>
    </div>
  );
}
