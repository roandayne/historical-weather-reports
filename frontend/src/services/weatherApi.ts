import axios from 'axios';
import type { WeatherInfo, WeatherData, WeatherResponse } from '../types/weather';
import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from '../constants';

const api = axios.create({
  timeout: API_CONFIG.DEFAULT_TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error(ERROR_MESSAGES.NETWORK.TIMEOUT);
    }
    if (error.response) {
      const message = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(message);
    }
    if (error.request) {
      throw new Error(ERROR_MESSAGES.NETWORK.NO_RESPONSE);
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

export const weatherApi = {
  getCurrentWeather: async (lat: number, lon: number): Promise<WeatherInfo> => {
    try {
      const response = await api.get(API_ENDPOINTS.CURRENT_WEATHER, {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch current weather: ${error.message}`);
      }
      throw new Error('Failed to fetch current weather');
    }
  },

  generateReport: async (data: WeatherData): Promise<WeatherResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.WEATHER_DATA, data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate report: ${error.message}`);
      }
      throw new Error('Failed to generate report');
    }
  }
}; 