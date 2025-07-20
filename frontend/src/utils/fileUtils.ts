import axios from 'axios';

const api = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const downloadFile = async (filename: string): Promise<void> => {
  try {
    const response = await api.get(`/api/download/${filename}`, {
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
        throw new Error('File download timed out. Please try again.');
      }
      if (error.response) {
        const message = error.response.data?.message || `Server error (${error.response.status}): Failed to download file`;
        throw new Error(message);
      }
      if (error.request) {
        throw new Error('No response from server while downloading file. Please try again.');
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
    throw new Error('Failed to download file');
  }
};

export const formatDateForBackend = (date: any) => {
  return date.format('DD-MM-YYYY');
}; 