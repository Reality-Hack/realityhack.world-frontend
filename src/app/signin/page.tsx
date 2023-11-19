'use client';

import Loader from '@/components/Loader';
import { signIn, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';

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
