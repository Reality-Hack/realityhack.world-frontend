import { components } from '@/types/schema';

export type Table = components['schemas']['Table'];

export async function getAllTables(accessToken: string): Promise<Table[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tables/`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    return await resp.json();
  }
  throw new Error('Failed to fetch data. Status: ' + resp.status);
}
