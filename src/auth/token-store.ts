import { AuthSession } from '@/auth/types';

type SessionGetter = () => AuthSession | null;

let getter: SessionGetter = () => null;

export function setSessionGetter(nextGetter: SessionGetter): void {
  getter = nextGetter;
}

export function getAccessToken(): string | null {
  const session = getter();
  return session?.access_token ?? null;
}
