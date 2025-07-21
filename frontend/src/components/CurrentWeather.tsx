import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { DeviceThermostat, WaterDrop, Opacity, Air } from '@mui/icons-material';
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import type { FC } from 'react';
import {
  containerStyles,
  titleStyles,
  weatherDataContainerStyles,
  weatherItemStyles,
  iconStyles,
} from '../styles/CurrentWeather.styles';

interface CurrentWeatherProps {
  lat?: string;
  lon?: string;
  location: string;
}

export const CurrentWeather: FC<CurrentWeatherProps> = ({
  lat,
  lon,
  location,
}) => {
  const coordinates =
    lat && lon
      ? {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        }
      : null;

  const { weather, isLoading, error } = useCurrentWeather(coordinates);

  if (!lat || !lon) return null;
  if (isLoading) return <CircularProgress />;
  if (error || !weather) return null;

  return (
    <Box sx={containerStyles}>
      <Typography variant='h6' sx={titleStyles}>
        Current Weather in {location}
      </Typography>
      <Box sx={weatherDataContainerStyles}>
        <Tooltip title='Temperature' arrow>
          <Box sx={weatherItemStyles}>
            <DeviceThermostat sx={iconStyles} />
            <Typography>{weather.temp}°C</Typography>
          </Box>
        </Tooltip>
        <Tooltip title='Humidity' arrow>
          <Box sx={weatherItemStyles}>
            <WaterDrop sx={iconStyles} />
            <Typography>{weather.humidity}%</Typography>
          </Box>
        </Tooltip>
        <Tooltip title='Precipitation' arrow>
          <Box sx={weatherItemStyles}>
            <Opacity sx={iconStyles} />
            <Typography>{weather.precipitation}mm</Typography>
          </Box>
        </Tooltip>
        <Tooltip title='Wind Speed' arrow>
          <Box sx={weatherItemStyles}>
            <Air sx={iconStyles} />
            <Typography>{weather.wind_speed}m/s</Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
