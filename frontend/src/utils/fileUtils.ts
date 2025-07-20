import axios from 'axios';

export const downloadFile = async (filename: string): Promise<void> => {
  const response = await axios.get(`/api/download/${filename}`, {
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
};

export const formatDateForBackend = (date: any) => {
  return date.format('DD-MM-YYYY');
}; 