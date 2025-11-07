'use client';

import Loader from '@/components/Loader';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';

export default function SignIn(): ReactElement {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      signIn('keycloak');
    } else if (!session.error) {
      router.replace('/');
    }
  }, [session, router, status]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader />
    </div>
  );
}