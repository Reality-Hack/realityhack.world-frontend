/* eslint-disable no-console */
import jwt_decode from 'jwt-decode';
// import jwt_encode from 'jwt-encode';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

// this will refresh an expired access token, when needed
async function refreshAccessToken(token: JWT): Promise<JWT> {
  // if(process.env.KEYCLOAK_ISSUER_FAKE) {
  //   const decoded = jwt_decode(token.refresh_token);
  //   decoded.iss = process.env.KEYCLOAK_ISSUER_FAKE
  //   decoded.aud = process.env.KEYCLOAK_ISSUER_FAKE
  //   token.refresh_token = jwt_encode(decoded);
  // }
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
  const refreshToken = await resp.json();
  if (!resp.ok) throw refreshToken;
  const decoded: any = jwt_decode(refreshToken.access_token);
  // if(process.env.KEYCLOAK_ISSUER_FAKE)
  //   decoded.iss = process.env.KEYCLOAK_ISSUER_FAKE

  return {
    ...token,
    access_token: refreshToken.access_token,
    decoded,
    id_token: refreshToken.id_token,
    expires_at: refreshToken.expires_in + Math.floor(Date.now() / 1000),
    refresh_token: refreshToken.refresh_token
  };
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
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.id_token = token.id_token;
      session.roles = token.decoded.realm_access.roles;
      session.error = token.error;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
