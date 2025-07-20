import { useState, useEffect } from 'react';
import axios from 'axios';
import type { AlertState } from './useAlert';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

interface PlaceType {
  display_name: string;
  lat: string;
  lon: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

const api = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const useLocation = (showAlert: (type: AlertState['type'], message: string) => void) => {
  const [location, setLocation] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  
  const debouncedInput = useDebounce(inputValue, 300);

  const { data: reverseGeocodeData } = useQuery({
    queryKey: ['reverseGeocode', coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (!coordinates) return null;
      try {
        const response = await api.get('/api/reverse-geocode', {
          params: { lat: coordinates.lat, lon: coordinates.lon }
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
    retry: 1
  });

  useEffect(() => {
    if (reverseGeocodeData?.location) {
      setLocation(reverseGeocodeData.location);
    }
  }, [reverseGeocodeData]);

  const { data: geocodeData, isLoading } = useQuery({
    queryKey: ['geocode', debouncedInput],
    queryFn: async () => {
      if (debouncedInput.length < 3) return [];
      try {
        const response = await api.get<PlaceType[]>('/api/geocode', {
          params: { q: debouncedInput }
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          showAlert('error', `Search error: ${error.message}`);
        }
        throw error;
      }
    },
    enabled: debouncedInput.length >= 3,
    staleTime: 60 * 1000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: []
  });

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showAlert('error', 'Geolocation is not supported by this browser.');
      setLocation('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
      },
      (error) => {
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
    handleUseMyLocation
  };
}; 