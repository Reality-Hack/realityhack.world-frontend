import { authOptions } from '../[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { getIdToken } from '@/app/utils/sessionTokenAccessor';

export async function GET(): Promise<Response> {
  const session: any = await getServerSession(authOptions);

  const nextAuthUrl = process.env.NEXTAUTH_URL;

  if (!nextAuthUrl) {
    throw new Error('Environment variable NEXTAUTH_URL is not defined.');
  }

  const encodedUrl = encodeURIComponent(nextAuthUrl);

  if (session) {
    const idToken: string | null = await getIdToken();

    // this will log out the user on Keycloak side
    const url:
      | string
      | null = `${process.env.END_SESSION_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodedUrl}`;

    try {
      const resp: Response = await fetch(url, { method: 'GET' });
    } catch (err: any) {
      console.error(err);
      return new Response(null, { status: 500 });
    }
  }
  return new Response(null, { status: 200 });
}
