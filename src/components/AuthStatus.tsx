'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { ReactElement, useEffect } from 'react';
import Loader from './Loader';

async function keycloakSessionLogOut(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'GET' });
  } catch (err) {
    console.error(err);
  }
}

export default function AuthStatus(): ReactElement {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status !== 'loading' &&
      session &&
      (session as any).error === 'RefreshAccessTokenError'
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
          onClick={() => {
            keycloakSessionLogOut().then(() => signOut({ callbackUrl: '/' }));
          }}
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
