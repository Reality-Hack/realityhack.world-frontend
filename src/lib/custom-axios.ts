import Axios, { AxiosRequestConfig, AxiosError } from 'axios';

// Configure the axios instance to use the backend URL
export const AXIOS_INSTANCE = Axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
});

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