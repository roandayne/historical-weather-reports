import { Box, Typography, CircularProgress } from '@mui/material';
import { DeviceThermostat, WaterDrop, Opacity, Air } from '@mui/icons-material';
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import type { FC } from 'react';

interface CurrentWeatherProps {
  lat?: string;
  lon?: string;
  location: string;
}

export const CurrentWeather: FC<CurrentWeatherProps> = ({ lat, lon, location }) => {
  const coordinates = lat && lon ? {
    lat: parseFloat(lat),
    lon: parseFloat(lon)
  } : null;

  const { weather, isLoading, error } = useCurrentWeather(coordinates);

  if (!lat || !lon) return null;
  if (isLoading) return <CircularProgress />;
  if (error || !weather) return null;

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      color: 'text.primary'
    }}>
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        Current Weather in {location}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        gap: 4
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeviceThermostat sx={{ fontSize: 24 }} />
          <Typography>{weather.temp}°C</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WaterDrop sx={{ fontSize: 24 }} />
          <Typography>{weather.humidity}%</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Opacity sx={{ fontSize: 24 }} />
          <Typography>{weather.precipitation}mm</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Air sx={{ fontSize: 24 }} />
          <Typography>{weather.wind_speed}m/s</Typography>
        </Box>
      </Box>
    </Box>
  );
}; 