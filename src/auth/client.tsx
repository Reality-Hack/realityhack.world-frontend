'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import type KeycloakInstance from 'keycloak-js';
import { AUTH_ERROR_TYPES } from '@/constants/auth';
import { setSessionGetter } from '@/auth/token-store';
import {
  getClientRolesFromToken,
  filterEventRoles,
  hasClientRoles
} from '@/auth/token-utils';
import { AuthSession, AuthStatus, DecodedToken, UseSessionResponse } from './types';

const SESSION_STORAGE_KEY = 'rh.auth.keycloak.v1';

type SignOutOptions = {
  callbackUrl?: string;
  redirect?: boolean;
};

type AuthContextValue = {
  session: AuthSession | null;
  status: AuthStatus;
  signIn: (provider?: string) => Promise<void>;
  signOut: (options?: SignOutOptions) => Promise<void>;
  refreshSession: () => Promise<AuthSession | null>;
};

const AuthClientContext = createContext<AuthContextValue | null>(null);
let signInHandler: (() => Promise<void>) | null = null;
let signOutHandler: ((options?: SignOutOptions) => Promise<void>) | null = null;

function parseIssuer(issuer: string): { url: string; realm: string } {
  const idx = issuer.indexOf('/realms/');
  if (idx === -1) {
    throw new Error(`Invalid Keycloak issuer URL: ${issuer}`);
  }
  return {
    url: issuer.slice(0, idx),
    realm: issuer.slice(idx + '/realms/'.length)
  };
}

function getIssuer(): string {
  return import.meta.env.VITE_KEYCLOAK_ISSUER ?? '';
}

function getClientId(): string {
  return import.meta.env.VITE_KEYCLOAK_ID ?? '';
}

/**
 * Return URL after Keycloak login/logout. Must match an entry in the Keycloak client:
 * - "Valid redirect URIs" (login)
 * - "Valid post logout redirect URIs" (logout, Keycloak 18+)
 *
 * If unset, uses the current origin + `/signin` (localhost vs 127.0.0.1 are different origins).
 */
function getKeycloakAppRedirectUri(): string {
  if (typeof window === 'undefined') return '';
  const explicit = import.meta.env.VITE_KEYCLOAK_REDIRECT_URI?.trim();
  if (explicit) return explicit;
  return `${window.location.origin}/signin`;
}

interface StoredTokens {
  token: string;
  refreshToken?: string;
  idToken?: string;
}

function getStoredTokens(): StoredTokens | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredTokens;
  } catch {
    return null;
  }
}

function storeTokens(kc: KeycloakInstance): void {
  if (typeof window === 'undefined' || !kc.token) return;
  window.sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({
      token: kc.token,
      refreshToken: kc.refreshToken,
      idToken: kc.idToken
    })
  );
}

function clearStoredTokens(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

function buildSessionFromKeycloak(kc: KeycloakInstance): AuthSession {
  const decoded = kc.tokenParsed as DecodedToken | undefined;
  const clientRoles = decoded ? getClientRolesFromToken(decoded) : [];
  console.log("clientRoles", clientRoles);
  const filteredRoles = filterEventRoles(clientRoles);
  console.log("filteredRoles", filteredRoles);
  const error = hasClientRoles(clientRoles)
    ? undefined
    : AUTH_ERROR_TYPES.NO_CLIENT_ROLES;

  return {
    access_token: kc.token!,
    id_token: kc.idToken,
    refresh_token: kc.refreshToken,
    expires_at: decoded?.exp ?? 0,
    roles: filteredRoles,
    user: {
      email: decoded?.email,
      name:
        decoded?.given_name && decoded?.family_name
          ? `${decoded.given_name} ${decoded.family_name}`
          : decoded?.preferred_username
    },
    error
  };
}

export function AuthClientProvider({
  children
}: PropsWithChildren): JSX.Element {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const keycloakRef = useRef<KeycloakInstance | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const issuer = getIssuer();
    const clientId = getClientId();
    if (!issuer || !clientId) {
      console.error(
        'Missing VITE_KEYCLOAK_ISSUER or VITE_KEYCLOAK_ID env vars.'
      );
      setStatus('unauthenticated');
      return;
    }

    const { url, realm } = parseIssuer(issuer);

    (async () => {
      const { default: Keycloak } = await import('keycloak-js');
      const kc = new Keycloak({ url, realm, clientId });
      keycloakRef.current = kc;

      kc.onTokenExpired = () => {
        kc.updateToken(30)
          .then((refreshed: boolean) => {
            if (refreshed && kc.authenticated) {
              storeTokens(kc);
              setSession(buildSessionFromKeycloak(kc));
            }
          })
          .catch(() => {
            clearStoredTokens();
            setSession(null);
            setStatus('unauthenticated');
          });
      };

      const stored = getStoredTokens();

      try {
        const authenticated = await kc.init({
          pkceMethod: 'S256',
          checkLoginIframe: false,
          enableLogging: import.meta.env.NODE_ENV === 'development',
          ...(stored
            ? {
                token: stored.token,
                refreshToken: stored.refreshToken,
                idToken: stored.idToken
              }
            : {})
        });

        if (authenticated && kc.token) {
          console.debug('[auth] Keycloak authenticated successfully');
          storeTokens(kc);
          const authSession = buildSessionFromKeycloak(kc);
          setSession(authSession);
          setStatus('authenticated');
        } else {
          console.warn(
            '[auth] Keycloak init returned authenticated=%s, token=%s. ' +
              'If you just came back from Keycloak login, the token exchange likely failed. ' +
              'Common causes:\n' +
              '  1. Client is confidential (needs to be public for browser PKCE)\n' +
              '  2. CORS: Web Origins missing http://localhost:3000 in Keycloak client config\n' +
              '  3. Invalid redirect URI configuration',
            authenticated,
            kc.token ? 'present' : 'missing'
          );
          clearStoredTokens();
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('[auth] Keycloak init threw an error:', error);
        clearStoredTokens();
        setStatus('unauthenticated');
      }
    })();
  }, []);

  const doSignIn = useCallback(async () => {
    const kc = keycloakRef.current;
    if (!kc) return;
    kc.login({ redirectUri: getKeycloakAppRedirectUri() });
  }, []);

  const doSignOut = useCallback(async (options?: SignOutOptions) => {
    const kc = keycloakRef.current;
    clearStoredTokens();
    setSession(null);
    setStatus('unauthenticated');

    if (options?.redirect === false) return;

    if (kc) {
      kc.logout({
        redirectUri: options?.callbackUrl ?? getKeycloakAppRedirectUri()
      });
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<AuthSession | null> => {
    const kc = keycloakRef.current;
    if (!kc || !kc.authenticated) {
      setSession(null);
      setStatus('unauthenticated');
      return null;
    }

    try {
      await kc.updateToken(-1);
      storeTokens(kc);
      const authSession = buildSessionFromKeycloak(kc);
      setSession(authSession);
      setStatus('authenticated');
      return authSession;
    } catch {
      clearStoredTokens();
      const errorSession: AuthSession = {
        access_token: kc.token ?? '',
        expires_at: 0,
        roles: [],
        error: AUTH_ERROR_TYPES.REFRESH_TOKEN_ERROR
      };
      setSession(errorSession);
      return errorSession;
    }
  }, []);

  useEffect(() => {
    signInHandler = doSignIn;
    signOutHandler = doSignOut;
    return () => {
      signInHandler = null;
      signOutHandler = null;
    };
  }, [doSignIn, doSignOut]);

  useEffect(() => {
    setSessionGetter(() => session);
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      status,
      signIn: doSignIn,
      signOut: doSignOut,
      refreshSession
    }),
    [session, status, doSignIn, doSignOut, refreshSession]
  );

  return (
    <AuthClientContext.Provider value={value}>
      {children}
    </AuthClientContext.Provider>
  );
}

function useAuthClientContext(): AuthContextValue {
  const context = useContext(AuthClientContext);
  if (!context) {
    throw new Error('Auth hooks must be used within AuthClientProvider.');
  }
  return context;
}

export function useSession(): UseSessionResponse {
  const { session, status, refreshSession } = useAuthClientContext();
  return {
    data: session,
    status,
    update: refreshSession
  };
}

export async function signIn(_provider?: string): Promise<void> {
  if (!signInHandler) {
    throw new Error('Auth provider is not mounted yet.');
  }
  await signInHandler();
}

export async function signOut(options?: SignOutOptions): Promise<void> {
  if (!signOutHandler) {
    throw new Error('Auth provider is not mounted yet.');
  }
  await signOutHandler(options);
}

export function useAuthActions(): Pick<AuthContextValue, 'signIn' | 'signOut'> {
  const { signIn: doSignIn, signOut: doSignOut } = useAuthClientContext();
  return { signIn: doSignIn, signOut: doSignOut };
}
