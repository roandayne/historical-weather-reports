import axios from 'axios';
import type { WeatherInfo, WeatherData, WeatherResponse } from '../types/weather';

const api = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    if (error.response) {
      const message = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(message);
    }
    if (error.request) {
      throw new Error('No response from server. Please try again.');
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

export const weatherApi = {
  getCurrentWeather: async (lat: number, lon: number): Promise<WeatherInfo> => {
    try {
      const response = await api.get('/api/current-weather', {
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
      const response = await api.post('/api/weather-data', data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate report: ${error.message}`);
      }
      throw new Error('Failed to generate report');
    }
  }
}; 