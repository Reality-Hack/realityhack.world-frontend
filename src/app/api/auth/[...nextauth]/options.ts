import jwt_decode from 'jwt-decode';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { AUTH_ERROR_TYPES } from '@/constants/auth';

interface DecodedToken {
  resource_access?: {
    [clientId: string]: {
      roles: string[];
    };
  };
  exp: number;
  iat: number;
  sub: string;
  roles?: string[];
}

function getClientRolesFromToken(decodedToken: DecodedToken): string[] {
  const clientId = process.env.KEYCLOAK_ID || '';
  if (!clientId.length) { // for TS type safety
    console.error('KEYCLOAK_ID environment variable is not set');
    return [];
  }
  const clientRoles = decodedToken.resource_access?.[clientId]?.roles || [];
  return clientRoles;
}

function filterEventRoles(roles: string[]): string[] {
  const eventYear = process.env.EVENT_YEAR;
  return roles
    .filter((role: string) => role.includes(`:${eventYear}`))
    .map((role: string) => role.replace(`:${eventYear}`, ''));
}

function hasClientRoles(clientRoles: string[] | undefined): boolean {
  if (!Array.isArray(clientRoles) || clientRoles.length === 0) {
    return false;
  }
  const filteredRoles = filterEventRoles(clientRoles);
  return filteredRoles.length > 0;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const resp = await fetch(
      `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Forwarded-Host': `${process.env.NEXTAUTH_URL || ''}`
        },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_ID || '',
          client_secret: process.env.KEYCLOAK_SECRET || '',
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token || ''
        }),
        method: 'POST'
      }
    );

    if (!resp.ok) {
      const errorData = await resp.json();
      if (process.env.NODE_ENV === 'development') {
        console.error('Token refresh failed:', {
          status: resp.status,
          statusText: resp.statusText,
          error: errorData
        });
      }
      const error = new Error(`Token refresh failed: ${resp.status}`);
      (error as any).status = resp.status;
      (error as any).data = errorData;
      throw error;
    }

    const refreshToken = await resp.json();
    const decoded: DecodedToken = jwt_decode(refreshToken.access_token);

    return {
      ...token,
      access_token: refreshToken.access_token,
      decoded,
      id_token: refreshToken.id_token,
      expires_at: refreshToken.expires_in,
      refresh_token: refreshToken.refresh_token,
      error: undefined
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error refreshing access token:', error);
    }
    throw error;
  }
}

async function refreshAccessTokenWithRetry(
  token: JWT, 
  maxRetries: number = 3
): Promise<JWT> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await refreshAccessToken(token);
    } catch (error) {
      lastError = error as Error;

      if ((error as any).status === 400) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Refresh token is invalid or expired, not retrying');
        }
        throw lastError;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Token refresh attempt ${attempt} failed:`, error);
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff for network errors
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }
  
  throw lastError!;
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: `${process.env.KEYCLOAK_ID || ''}`,
      clientSecret: `${process.env.KEYCLOAK_SECRET || ''}`,
      issuer: `${process.env.KEYCLOAK_ISSUER_FAKE || process.env.KEYCLOAK_ISSUER || ''}`
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account }) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);
      if (account) {
        token.decoded = jwt_decode<DecodedToken>(account.access_token);
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        const clientRoles = getClientRolesFromToken(token.decoded);
        token.roles = clientRoles;
        if (!hasClientRoles(clientRoles)) {
          return { ...token, error: AUTH_ERROR_TYPES.NO_CLIENT_ROLES };
        }

        return token;
      } else if (nowTimeStamp < token.expires_at) {
        return token;
      } else {
        try {
          const refreshedToken = await refreshAccessTokenWithRetry(token);
          const roles = getClientRolesFromToken(refreshedToken.decoded);
          if (!hasClientRoles(roles)) {
            return { ...refreshedToken, error: AUTH_ERROR_TYPES.NO_CLIENT_ROLES };
          }

          return refreshedToken;
        } catch (error) {
          return { ...token, error: AUTH_ERROR_TYPES.REFRESH_TOKEN_ERROR };
        }
      }
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.id_token = token.id_token;

      const clientRoles = getClientRolesFromToken(token.decoded);
      const filteredRoles = filterEventRoles(clientRoles);
      session.roles = filteredRoles;
      session.error = token.error;
      return session;
    }
  }
};