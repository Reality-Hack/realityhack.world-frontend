'use client';

import Loader from '@/components/Loader';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, ReactElement } from 'react';

export default function SignIn(): ReactElement {
  const { data: session, status } = useSession();

  useEffect(() => {
    signIn('keycloak');
  }, []);

  return (
    <div
      className="fixed w-full h-full bg-center bg-cover "
      style={{ backgroundImage: `url('/images/starfield-grad.jpg')` }}
    >
      <Loader />
    </div>
  );
}
