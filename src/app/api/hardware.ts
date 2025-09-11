import { HardwareCategory } from '@/types/types2';

export async function getHardwareCategories(
  accessToken: string
): Promise<HardwareCategory[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardware/`;

  const resp = await fetch(url, {
    method: 'OPTIONS',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    const options = await resp.json();
    const data = options!['actions']['POST']['tags']['choices'];
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

// TODO: remove this after refactoring tests
export async function deleteHardwareRequest(accessToken: string, id: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardwarerequests/${id}/`;
  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    return;
  }

  throw new Error('Failed to send data. Status: ' + resp.status);
}
