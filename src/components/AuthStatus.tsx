'use client';

import { signIn, signOut, useSession } from '@/auth/client';
import { ReactElement, useEffect } from 'react';
import { AUTH_ERROR_TYPES } from '@/constants/auth';
import Loader from './Loader';

export default function AuthStatus(): ReactElement {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status !== 'loading' &&
      session?.error === AUTH_ERROR_TYPES.REFRESH_TOKEN_ERROR
    ) {
      signOut({ callbackUrl: '/' });
    }
  }, [session, status]);

  if (status === 'loading') {
    return <Loader />;
  } else if (session) {
    return (
      <div className="text-white justify-center flex flex-col p-6">
        Logged in as <span className="text-white">{session?.user?.email}</span>{' '}
        <br />
        <button
          className="px-2 py-1 font-bold text-white border rounded border-gray-50 w-20"
          onClick={() => signOut()}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="my-3">
      Not logged in.{' '}
      <button
        className="px-2 py-1 font-bold text-white bg-blue-900 border rounded border-gray-50"
        onClick={() => signIn('keycloak')}
      >
        Log in
      </button>
    </div>
  );
}
