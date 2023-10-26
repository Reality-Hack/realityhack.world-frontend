import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { decrypt } from './encryption';

type SessionType = {
  access_token: string;
  id_token: string;
  [key: string]: any;
};

export async function getAccessToken(): Promise<any | null> {
  const session: SessionType | null = await getServerSession(authOptions);
  if (session && session?.access_token) {
    const accessTokenDecrypted: string = decrypt(
      session?.access_token as string
    );
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken(): Promise<string | null> {
  const session: SessionType | null = await getServerSession(authOptions);
  if (session && session?.id_token) {
    const idTokenDecrypted: string = decrypt(session?.id_token as string);
    return idTokenDecrypted;
  }
  return null;
}
