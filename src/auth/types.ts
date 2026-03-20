import { AUTH_ERROR_TYPES } from '@/constants/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthErrorType =
  | (typeof AUTH_ERROR_TYPES)[keyof typeof AUTH_ERROR_TYPES]
  | undefined;

export interface DecodedToken {
  resource_access?: Record<string, { roles: string[] }>;
  exp: number;
  iat: number;
  sub: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
}

export interface AuthSessionUser {
  email?: string;
  name?: string;
}

export interface AuthSession {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_at: number;
  roles: string[];
  user?: AuthSessionUser;
  error?: AuthErrorType;
}

export interface StoredAuthSession extends AuthSession {
  decoded?: DecodedToken;
}

export interface UseSessionResponse {
  data: AuthSession | null;
  status: AuthStatus;
  update: () => Promise<AuthSession | null>;
}
