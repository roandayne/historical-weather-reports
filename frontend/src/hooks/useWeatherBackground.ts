import type { WeatherInfo } from '../types/weather';
import { useCurrentWeather } from './useCurrentWeather';

interface Coordinates {
  lat: number;
  lon: number;
}

export const useWeatherBackground = (coordinates: Coordinates | null) => {
  const { weather } = useCurrentWeather(coordinates);
  return { weather };
}; 