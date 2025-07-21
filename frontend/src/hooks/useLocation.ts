import { useState, useEffect } from 'react';
import type { AlertState } from './useAlert';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { API_ENDPOINTS, UI_CONFIG, ERROR_MESSAGES } from '../constants';
import { apiClient, geocodingClient } from '../services/axiosConfig';

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
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  const debouncedInput = useDebounce(
    inputValue,
    UI_CONFIG.SEARCH_DEBOUNCE_DELAY
  );

  const checkGeolocationPermission = async (): Promise<PermissionState> => {
    try {
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionState(result.state);
        return result.state;
      } else {
        return 'prompt';
      }
    } catch (error) {
      console.warn('Error checking geolocation permission:', error);
      return 'prompt';
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(ERROR_MESSAGES.GEOLOCATION.NOT_SUPPORTED));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      };

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => {
          let errorMessage: string;
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = ERROR_MESSAGES.GEOLOCATION.PERMISSION_DENIED;
              setPermissionState('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = ERROR_MESSAGES.GEOLOCATION.POSITION_UNAVAILABLE;
              break;
            case error.TIMEOUT:
              errorMessage = ERROR_MESSAGES.GEOLOCATION.TIMEOUT;
              break;
            default:
              errorMessage = `Geolocation error: ${error.message}`;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  };

  const { data: reverseGeocodeData } = useQuery({
    queryKey: ['reverseGeocode', coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (!coordinates) return null;

      if (isNaN(coordinates.lat) || isNaN(coordinates.lon) || 
          !isFinite(coordinates.lat) || !isFinite(coordinates.lon)) {
        console.warn('Invalid coordinates for reverse geocoding:', coordinates);
        return null;
      }
      
      try {
        const response = await geocodingClient.get(API_ENDPOINTS.REVERSE_GEOCODE, {
          params: { lat: coordinates.lat, lon: coordinates.lon },
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          const errorMessage = error.message.includes('timeout') 
            ? ERROR_MESSAGES.GEOCODING.REVERSE_TIMEOUT
            : `Failed to get location: ${error.message}`;
          showAlert('error', errorMessage);
        }
        throw error;
      }
    },
    enabled: !!coordinates?.lat && 
             !!coordinates?.lon && 
             !isNaN(coordinates.lat) && 
             !isNaN(coordinates.lon) &&
             isFinite(coordinates.lat) && 
             isFinite(coordinates.lon),
    staleTime: Infinity,
    retry: UI_CONFIG.GEOCODING_RETRY_COUNT,
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
        const response = await geocodingClient.get<PlaceType[]>(
          API_ENDPOINTS.GEOCODE,
          {
            params: { q: debouncedInput },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          const errorMessage = error.message.includes('timeout') 
            ? ERROR_MESSAGES.GEOCODING.TIMEOUT
            : `Search error: ${error.message}`;
          showAlert('error', errorMessage);
        }
        throw error;
      }
    },
    enabled: debouncedInput.length >= UI_CONFIG.MIN_SEARCH_LENGTH,
    staleTime: UI_CONFIG.SEARCH_STALE_TIME,
    gcTime: UI_CONFIG.SEARCH_GC_TIME,
    retry: UI_CONFIG.GEOCODING_RETRY_COUNT,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });

  const handleAutoLocationRequest = async () => {
    setIsCheckingPermission(true);
    try {
      const permission = await checkGeolocationPermission();
      
      if (permission === 'granted') {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
      }
    } catch (error) {
      console.error('Error in auto location request:', error);
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const handleUseMyLocation = async () => {
    try {
      setIsCheckingPermission(true);
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      setCoordinates(null);
      setTimeout(() => {
        setCoordinates({ lat: latitude, lon: longitude });
      }, 0);
      
      setPermissionState('granted');
    } catch (error) {
      console.error('Error getting geolocation:', error);
      if (error instanceof Error) {
        showAlert('error', error.message);
      }
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const setLocationAndCoordinates = (locationName: string, coords?: { lat: string; lon: string }) => {
    setLocation(locationName);
    if (coords) {
      const lat = parseFloat(coords.lat);
      const lon = parseFloat(coords.lon);
      
      if (!isNaN(lat) && !isNaN(lon) && isFinite(lat) && isFinite(lon)) {
        setCoordinates({
          lat,
          lon,
        });
      } else {
        console.warn('Invalid coordinates received:', coords);
      }
    }
  };

  return {
    location,
    setLocation,
    inputValue,
    setInputValue,
    options: geocodeData || [],
    loading: isLoading,
    coordinates,
    permissionState,
    isCheckingPermission,
    handleUseMyLocation,
    handleAutoLocationRequest,
    setLocationAndCoordinates,
  };
};
