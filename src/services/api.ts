import axios, { AxiosError } from 'axios';

import session from '../stores/session';

export type RespAPI<Success> = {
  status: number;
  data: Success | AxiosError;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {},
});

api.interceptors.request.use(request => {
  const token = session.get();
  if (token !== null) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError): RespAPI<AxiosError> => {
    // logout user when he's not authorized
    if (error.response?.status === 401) {
      session.delete();
    }

    return {
      status: error.response?.status || 500,
      data: (error.response?.data as AxiosError) || {
        message: error.message,
      },
    };
  }
);

export default api;
