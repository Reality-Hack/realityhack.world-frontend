'use client';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session && pathname !== '/apply' && pathname !== '/signin') {
      router.replace('/apply');
      return;
    }

    if (session) {
      router.replace('/');
    }
  }, []);

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
