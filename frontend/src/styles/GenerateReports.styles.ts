import type { SxProps, Theme } from '@mui/material';
import type { WeatherInfo } from '../types/weather';
import { getWeatherBackground } from '../utils/weatherBackground';

interface Coordinates {
  lat: number;
  lon: number;
}

export const getBackgroundStyle = (coordinates: Coordinates | null, weather: WeatherInfo | null, location: string | null): SxProps<Theme> => {
  if (!coordinates || !weather || !location) return {
    backgroundColor: '#87CEEB',
    minHeight: '100vh',
    padding: '40px 20px'
  };
  
  return {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url("${getWeatherBackground(weather)}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    padding: '40px 20px'
  };
};

export const containerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  maxWidth: '100vw',
  margin: 0,
  height: '100vh',
  padding: '40px 20px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '& > *:not(:first-child)': {
    width: {xs: '90%', sm: '65%'},
    maxWidth: '1200px'
  }
};

export const formPaperStyles: SxProps<Theme> = {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)'
};

export const formContainerStyles: SxProps<Theme> = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}; 