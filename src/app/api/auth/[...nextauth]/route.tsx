import jwt_decode from 'jwt-decode';
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { encrypt } from '../../../utils/encryption';

interface Token {
  decoded?: any;
  access_token: string;
  id_token: string;
  expires_at: number;
  refresh_token?: string;
  error?: string;
}

// this will refresh an expired access token, when needed
async function refreshAccessToken(token: Token): Promise<Token> {
  const resp = await fetch(
    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_ID || '',
        client_secret: process.env.KEYCLOAK_SECRET || '',
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token || ''
      }),
      method: 'POST'
    }
  );
  const refreshToken = await resp.json();
  if (!resp.ok) throw refreshToken;

  return {
    ...token,
    access_token: refreshToken.access_token,
    decoded: jwt_decode(refreshToken.access_token),
    id_token: refreshToken.id_token,
    expires_at: refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token
  };
}

export const authOptions: any = {
  providers: [
    KeycloakProvider({
      clientId: `${process.env.KEYCLOAK_ID || ''}`,
      clientSecret: `${process.env.KEYCLOAK_SECRET || ''}`,
      issuer: `${process.env.KEYCLOAK_ISSUER || ''}`
    })
  ],

  callbacks: {
    async jwt({
      token,
      account
    }: {
      token: Token;
      account?: any;
    }): Promise<Token> {
      const nowTimeStamp = Math.floor(Date.now() / 1000);

      if (account) {
        token.decoded = jwt_decode(account.access_token);
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        return token;
      } else if (nowTimeStamp < token.expires_at) {
        return token;
      } else {
        try {
          const refreshedToken = await refreshAccessToken(token);
          return refreshedToken;
        } catch (error) {
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }
    },
    async session({
      session,
      token
    }: {
      session: any;
      token: Token;
    }): Promise<any> {
      session.access_token = encrypt(token.access_token);
      session.id_token = encrypt(token.id_token);
      session.roles = token.decoded.realm_access.roles;
      session.error = token.error;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
