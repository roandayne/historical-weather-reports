import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { WeatherData, WeatherResponse, ErrorResponse } from '../types/weather';
import { weatherApi } from '../services/weatherApi';
import { downloadFile } from '../utils/fileUtils';
import type { AlertState } from './useAlert';
import { SUCCESS_MESSAGES } from '../constants';

export const useReportGeneration = (showAlert: (type: AlertState['type'], message: string) => void) => {
  const mutation = useMutation<WeatherResponse, AxiosError<ErrorResponse>, WeatherData>({
    mutationFn: (data: WeatherData) => weatherApi.generateReport(data),
    onSuccess: (response) => {
      downloadFile(response.excel_report)
        .then(() => downloadFile(response.pdf_report))
        .then(() => {
          showAlert('success', SUCCESS_MESSAGES.REPORT_GENERATED);
        })
        .catch((error) => {
          showAlert('error', error instanceof Error ? error.message : 'Error downloading files. Please try again.');
        });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showAlert('error', error.response?.data?.message || error.message || 'Error generating report. Please try again.');
    },
  });

  return {
    generateReport: mutation.mutate,
    isGenerating: mutation.isPending
  };
}; 