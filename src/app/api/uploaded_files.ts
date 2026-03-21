import { components } from '@/types/schema';

export type FileUpload = components['schemas']['FileUpload'];

export async function getUploadedFile(
  id: string,
  accessToken: string
): Promise<FileUpload> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/uploaded_files/${id}/`;
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

export function fixFileLink(file: string) {
  return (file.startsWith("http") ? "" : import.meta.env.VITE_BACKEND_URL) + file;
}
