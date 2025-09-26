import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/options';

export async function GET(): Promise<Response> {
  const session: any = await getServerSession(authOptions);

  const nextAuthUrl = process.env.NEXTAUTH_URL;

  if (!nextAuthUrl) {
    throw new Error('Environment variable NEXTAUTH_URL is not defined.');
  }

  const encodedUrl = encodeURIComponent(nextAuthUrl);

  if (session) {
    // this will log out the user on Keycloak side
    const url:
      | string
      | null = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?id_token_hint=${session.id_token}&post_logout_redirect_uri=${encodedUrl}`;

    try {
      const resp: Response = await fetch(url, { method: 'GET' });
    } catch (err: any) {
      console.error(err);
      return new Response(null, { status: 500 });
    }
  }
  return new Response(null, { status: 200 });
}
