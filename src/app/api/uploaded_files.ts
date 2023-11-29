import { components } from '@/types/schema';

export type FileUpload = components['schemas']['FileUpload'];

export async function getUploadedFile(
  id: string,
  accessToken: string
): Promise<FileUpload> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploaded_files/${id}/`;
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
