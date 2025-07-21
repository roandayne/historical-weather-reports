import type { WeatherData } from '../types/weather';
import { API_ENDPOINTS } from '../constants';
import { apiClient } from './axiosConfig';

export const weatherApi = {
  getCurrentWeather: async (lat: number, lon: number) => {
    const response = await apiClient.get(API_ENDPOINTS.CURRENT_WEATHER, {
      params: { lat, lon },
    });
    return response.data;
  },

  generateReport: async (data: WeatherData) => {
    const response = await apiClient.post(API_ENDPOINTS.WEATHER_DATA, data);
    return response.data;
  },
};
