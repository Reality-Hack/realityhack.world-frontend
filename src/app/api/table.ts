import { components } from '@/types/schema';

export type Table = components['schemas']['Table'];

export async function getAllTables(accessToken: string): Promise<Table[]> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/tables/`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    }
  });

  if (resp.ok) {
    return await resp.json();
  }
  throw new Error('Failed to fetch data. Status: ' + resp.status);
}
