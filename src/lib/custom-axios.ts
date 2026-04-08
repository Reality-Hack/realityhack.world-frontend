import Axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken } from '@/auth/token-store';
import { signOut } from '@/auth/client';

export const AXIOS_INSTANCE = Axios.create({ 
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Multipart body for POST/PUT /uploaded_files/ (Django FileField rejects JSON). */
export function fileUploadRequestToFormData(body: {
  file: Blob;
  claimed?: boolean;
}): FormData {
  const formData = new FormData();
  formData.append('file', body.file);
  if (body.claimed !== undefined) {
    formData.append('claimed', body.claimed ? 'true' : 'false');
  }
  return formData;
}

/** Multipart body for PATCH /uploaded_files/:id/ */
export function patchedFileUploadRequestToFormData(body: {
  file?: Blob;
  claimed?: boolean;
}): FormData {
  const formData = new FormData();
  if (body.file !== undefined) {
    formData.append('file', body.file);
  }
  if (body.claimed !== undefined) {
    formData.append('claimed', body.claimed ? 'true' : 'false');
  }
  return formData;
}

export const customAxios = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type
export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;