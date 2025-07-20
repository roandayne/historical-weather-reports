import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from '../constants';

const api = axios.create({
  timeout: API_CONFIG.FILE_DOWNLOAD_TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

export const downloadFile = async (filename: string): Promise<void> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.DOWNLOAD}/${filename}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error(ERROR_MESSAGES.NETWORK.TIMEOUT);
      }
      if (error.response) {
        const message = error.response.data?.message || `Server error (${error.response.status}): Failed to download file`;
        throw new Error(message);
      }
      if (error.request) {
        throw new Error(ERROR_MESSAGES.NETWORK.NO_RESPONSE);
      }
    }
    if (error instanceof Error) {
      throw new Error(`${ERROR_MESSAGES.FILE.DOWNLOAD_FAILED}: ${error.message}`);
    }
    throw new Error(ERROR_MESSAGES.FILE.DOWNLOAD_FAILED);
  }
};

export const formatDateForBackend = (date: any) => {
  return date.format('DD-MM-YYYY');
}; 