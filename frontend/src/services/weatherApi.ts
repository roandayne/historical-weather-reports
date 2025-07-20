import axios from 'axios';
import type { WeatherInfo, WeatherData, WeatherResponse } from '../types/weather';

export const weatherApi = {
  getCurrentWeather: async (lat: number, lon: number): Promise<WeatherInfo> => {
    const response = await axios.get('/api/current-weather', {
      params: { lat, lon }
    });
    return response.data;
  },

  generateReport: async (data: WeatherData): Promise<WeatherResponse> => {
    const response = await axios.post('/api/weather-data', data);
    return response.data;
  }
}; 