import { useQuery } from '@tanstack/react-query';
import type { WeatherInfo } from '../types/weather';
import { weatherApi } from '../services/weatherApi';

interface Coordinates {
  lat: number;
  lon: number;
}

export const useCurrentWeather = (coordinates: Coordinates | null) => {
  const { data: weather, isLoading, error } = useQuery<WeatherInfo, Error>({
    queryKey: ['currentWeather', coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (!coordinates) throw new Error('Coordinates required');
      return weatherApi.getCurrentWeather(coordinates.lat, coordinates.lon);
    },
    enabled: !!coordinates?.lat && !!coordinates?.lon,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1
  });

  return { weather, isLoading, error };
}; 