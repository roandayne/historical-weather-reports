import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface PlaceType {
  display_name: string;
  lat: string;
  lon: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<PlaceType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPlaces = async () => {
      try {
        if (inputValue.length < 3) {
          setOptions([]);
          return;
        }

        setLoading(true);
        const response = await axios.get('/api/geocode', {
          params: { q: inputValue }
        });

        if (active) {
          setOptions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch places:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPlaces, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      setLocation('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get('/api/reverse-geocode', {
            params: { lat: latitude, lon: longitude }
          });
          setLocation(response.data.location || 'Could not find location');
        } catch (error) {
          console.error('Error fetching location name:', error);
          setLocation(error instanceof AxiosError ? `Error: ${error.message}` : 'Error fetching location name');
        }
      },
      (error) => {
        console.error('Error getting geolocation:', error);
        setLocation(`Error: ${error.message}`);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
      }
    );
  };

  return {
    location,
    setLocation,
    inputValue,
    setInputValue,
    options,
    loading,
    handleUseMyLocation
  };
}; 