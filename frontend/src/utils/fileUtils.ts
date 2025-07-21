import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants';
import { fileClient } from '../services/axiosConfig';
import type { Dayjs } from 'dayjs';

export const downloadFile = async (filename: string): Promise<void> => {
  try {
    const response = await fileClient.get(
      `${API_ENDPOINTS.DOWNLOAD}/${filename}`,
      {
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `${ERROR_MESSAGES.FILE.DOWNLOAD_FAILED}: ${error.message}`
      );
    }
    throw new Error(ERROR_MESSAGES.FILE.DOWNLOAD_FAILED);
  }
};

export const formatDateForBackend = (date: Dayjs) => {
  return date.format('DD-MM-YYYY');
};
