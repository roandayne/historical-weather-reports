import { useQuery } from '@tanstack/react-query';
import type { WeatherInfo } from '../types/weather';
import { weatherApi } from '../services/weatherApi';
import { UI_CONFIG } from '../constants';

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
    staleTime: UI_CONFIG.WEATHER_STALE_TIME,
    gcTime: UI_CONFIG.WEATHER_GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: UI_CONFIG.DEFAULT_RETRY_COUNT
  });

  return { weather, isLoading, error };
}; 