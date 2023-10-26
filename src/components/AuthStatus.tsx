'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, ReactElement } from 'react';

async function keycloakSessionLogOut(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'GET' });
  } catch (err) {
    console.error(err);
  }
}

export default function AuthStatus(): ReactElement {
  // TODO - compare useSession() with getServerSession()
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

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
    return <div className="my-3">Loading...</div>;
  } else if (session) {
    return (
      <div className="my-3">
        Logged in as{' '}
        <span className="text-[#999999]">{session?.user?.email}</span>{' '}
        <button
          className="px-2 py-1 font-bold text-white bg-blue-900 border rounded border-gray-50"
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
