'use client';

import { ReactElement, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Loader from '@/components/Loader';
import { signIn } from 'next-auth/react';

export default function SignIn(): ReactElement {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      signIn('keycloak');
    } else if (pathname !== '/') {
      router.replace('/');
    }
  }, [session, router, status]);

  return (
    <div
      className="fixed w-full h-full bg-center bg-cover "
      style={{ backgroundImage: `url('/images/starfield-grad.jpg')` }}
    >
      <Loader />
    </div>
  );
}
