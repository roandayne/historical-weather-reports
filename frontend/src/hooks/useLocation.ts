import { useState, useEffect } from 'react';
import type { AlertState } from './useAlert';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { API_ENDPOINTS, UI_CONFIG, ERROR_MESSAGES } from '../constants';
import { apiClient } from '../services/axiosConfig';

interface PlaceType {
  display_name: string;
  lat: string;
  lon: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export const useLocation = (
  showAlert: (type: AlertState['type'], message: string) => void
) => {
  const [location, setLocation] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const debouncedInput = useDebounce(
    inputValue,
    UI_CONFIG.SEARCH_DEBOUNCE_DELAY
  );

  const { data: reverseGeocodeData } = useQuery({
    queryKey: ['reverseGeocode', coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (!coordinates) return null;
      try {
        const response = await apiClient.get(API_ENDPOINTS.REVERSE_GEOCODE, {
          params: { lat: coordinates.lat, lon: coordinates.lon },
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          showAlert('error', `Failed to get location: ${error.message}`);
        }
        throw error;
      }
    },
    enabled: !!coordinates?.lat && !!coordinates?.lon,
    staleTime: Infinity,
    retry: UI_CONFIG.DEFAULT_RETRY_COUNT,
  });

  useEffect(() => {
    if (reverseGeocodeData?.location) {
      setLocation(reverseGeocodeData.location);
    }
  }, [reverseGeocodeData]);

  const { data: geocodeData, isLoading } = useQuery({
    queryKey: ['geocode', debouncedInput],
    queryFn: async () => {
      if (debouncedInput.length < UI_CONFIG.MIN_SEARCH_LENGTH) return [];
      try {
        const response = await apiClient.get<PlaceType[]>(
          API_ENDPOINTS.GEOCODE,
          {
            params: { q: debouncedInput },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          showAlert('error', `Search error: ${error.message}`);
        }
        throw error;
      }
    },
    enabled: debouncedInput.length >= UI_CONFIG.MIN_SEARCH_LENGTH,
    staleTime: UI_CONFIG.SEARCH_STALE_TIME,
    gcTime: UI_CONFIG.SEARCH_GC_TIME,
    retry: UI_CONFIG.DEFAULT_RETRY_COUNT,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showAlert('error', ERROR_MESSAGES.GEOLOCATION.NOT_SUPPORTED);
      setLocation('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCoordinates(null);
        setTimeout(() => {
          setCoordinates({ lat: latitude, lon: longitude });
        }, 0);
      },
      error => {
        console.error('Error getting geolocation:', error);
        showAlert('error', `Error: ${error.message}`);
      }
    );
  };

  return {
    location,
    setLocation,
    inputValue,
    setInputValue,
    options: geocodeData || [],
    loading: isLoading,
    coordinates,
    handleUseMyLocation,
  };
};
