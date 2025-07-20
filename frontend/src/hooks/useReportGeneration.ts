import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { WeatherData, WeatherResponse, ErrorResponse } from '../types/weather';
import { weatherApi } from '../services/weatherApi';
import { downloadFile } from '../utils/fileUtils';
import { useAlert } from './useAlert';

export const useReportGeneration = () => {
  const { showAlert } = useAlert();

  const mutation = useMutation<WeatherResponse, AxiosError<ErrorResponse>, WeatherData>({
    mutationFn: weatherApi.generateReport,
    onSuccess: async (response) => {
      try {
        await downloadFile(response.excel_report);
        await downloadFile(response.pdf_report);
        showAlert('success', 'Reports generated and downloaded successfully!');
      } catch (error) {
        showAlert('error', 'Error downloading files. Please try again.');
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showAlert('error', error.response?.data?.message || 'Error generating report. Please try again.');
    },
  });

  return {
    generateReport: mutation.mutate,
    isGenerating: mutation.isPending
  };
}; 