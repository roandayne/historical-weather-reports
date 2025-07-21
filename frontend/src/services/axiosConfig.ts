import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

interface ErrorResponse {
  message?: string;
  error?: string;
}

const createBaseInstance = (timeout: number): AxiosInstance => {
  const instance = axios.create({
    timeout,
    headers: API_CONFIG.DEFAULT_HEADERS,
  });

  instance.interceptors.response.use(
    response => response,
    (error: AxiosError<ErrorResponse>) => {
      if (error.code === 'ECONNABORTED') {
        throw new Error(ERROR_MESSAGES.NETWORK.TIMEOUT);
      }
      if (error.response) {
        console.log(error.response);
        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        throw new Error(message);
      }
      if (error.request) {
        throw new Error(ERROR_MESSAGES.NETWORK.NO_RESPONSE);
      }
      throw new Error(error.message || 'An unexpected error occurred');
    }
  );

  return instance;
};

export const apiClient = createBaseInstance(API_CONFIG.DEFAULT_TIMEOUT);

export const fileClient = createBaseInstance(API_CONFIG.FILE_DOWNLOAD_TIMEOUT);

export const geocodingClient = createBaseInstance(API_CONFIG.GEOCODING_TIMEOUT);

export const handleApiError = (error: unknown, context: string): never => {
  if (error instanceof Error) {
    throw new Error(`${context}: ${error.message}`);
  }
  throw new Error(context);
};
