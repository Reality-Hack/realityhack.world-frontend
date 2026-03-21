import Loader from '@/components/Loader';
import { signIn, useSession } from '@/auth/client';
import { useAppNavigate } from '@/routing';
import { ReactElement, useEffect, useState } from 'react';

const LOGIN_ATTEMPT_KEY = 'rh.auth.login_attempted';

export default function SignIn(): ReactElement {
  const { data: session, status } = useSession();
  const router = useAppNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (session && !session.error) {
      sessionStorage.removeItem(LOGIN_ATTEMPT_KEY);
      router.replace('/');
      return;
    }

    const alreadyAttempted = sessionStorage.getItem(LOGIN_ATTEMPT_KEY);

    if (!session && !alreadyAttempted) {
      sessionStorage.setItem(LOGIN_ATTEMPT_KEY, '1');
      signIn('keycloak');
      return;
    }

    if (!session && alreadyAttempted) {
      sessionStorage.removeItem(LOGIN_ATTEMPT_KEY);
      setError(
        'Authentication failed. Check the browser console for details. The Keycloak client may need to be configured as a public client for browser-based login.'
      );
    }
  }, [session, router, status]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold text-red-600">Sign-in Failed</h1>
        <p className="text-gray-600 max-w-md">{error}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            setError(null);
            signIn('keycloak');
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader />
    </div>
  );
}
