import { useQuery } from '@tanstack/react-query';
import type { WeatherInfo } from '../types/weather';
import { weatherApi } from '../services/weatherApi';

interface Coordinates {
  lat: number;
  lon: number;
}

export const useWeatherBackground = (coordinates: Coordinates | null) => {
  const { data: weather } = useQuery<WeatherInfo | null>({
    queryKey: ['currentWeather', coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (!coordinates) return null;
      return weatherApi.getCurrentWeather(coordinates.lat, coordinates.lon);
    },
    enabled: !!coordinates?.lat && !!coordinates?.lon
  });

  return { weather };
}; 