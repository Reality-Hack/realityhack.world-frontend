import type { FileUpload, FileUploadRequest, PatchedFileUploadRequest } from '@/types/models';
import { customAxios, fileUploadRequestToFormData, patchedFileUploadRequestToFormData } from '@/lib/custom-axios';

/**
 * Multipart upload to POST /uploaded_files/ (Django FileField; Orval-generated client uses JSON and breaks).
 * Use this instead of `uploadedFilesCreate` from `@/types/endpoints` for real file blobs.
 */
export function createUploadedFile(
  body: FileUploadRequest,
  options?: Parameters<typeof customAxios>[1],
): Promise<FileUpload> {
  return customAxios<FileUpload>(
    {
      url: '/uploaded_files/',
      method: 'POST',
      data: fileUploadRequestToFormData(body),
    },
    options,
  );
}

/** PUT /uploaded_files/:id/ with multipart body. */
export function updateUploadedFile(
  id: string,
  body: FileUploadRequest,
  options?: Parameters<typeof customAxios>[1],
): Promise<FileUpload> {
  return customAxios<FileUpload>(
    {
      url: `/uploaded_files/${id}/`,
      method: 'PUT',
      data: fileUploadRequestToFormData(body),
    },
    options,
  );
}

/** PATCH /uploaded_files/:id/ with multipart body. */
export function patchUploadedFile(
  id: string,
  body: PatchedFileUploadRequest,
  options?: Parameters<typeof customAxios>[1],
): Promise<FileUpload> {
  return customAxios<FileUpload>(
    {
      url: `/uploaded_files/${id}/`,
      method: 'PATCH',
      data: patchedFileUploadRequestToFormData(body),
    },
    options,
  );
}
