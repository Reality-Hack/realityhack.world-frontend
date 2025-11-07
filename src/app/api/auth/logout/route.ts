import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/options';

export async function GET(): Promise<Response> {
  const session: any = await getServerSession(authOptions);

  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const keycloakId = process.env.KEYCLOAK_ID;
  
  if (!nextAuthUrl) {
    throw new Error('Environment variable NEXTAUTH_URL is not defined.');
  }

  const encodedUrl = encodeURIComponent(nextAuthUrl);

  let logoutUrl: string;
  if (session?.id_token) {
    logoutUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?id_token_hint=${session.id_token}&post_logout_redirect_uri=${encodedUrl}`;
  } else {
    logoutUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?client_id=${keycloakId}&post_logout_redirect_uri=${encodedUrl}`;
  }

  return Response.json({ url: logoutUrl });
}
