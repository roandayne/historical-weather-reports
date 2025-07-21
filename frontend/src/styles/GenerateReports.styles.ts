import type { SxProps, Theme } from '@mui/material';
import type { WeatherInfo } from '../types/weather';
import { getWeatherBackground } from '../utils/weatherBackground';
import { DESIGN_TOKENS } from './theme';
import { createBackgroundOverlay, transitions } from './shared';

interface Coordinates {
  lat: number;
  lon: number;
}

export const containerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: DESIGN_TOKENS.spacing.xxxl,
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  maxWidth: '100vw',
  margin: 0,
  minHeight: '100vh',
  padding: DESIGN_TOKENS.spacing.xxxl + ' ' + DESIGN_TOKENS.spacing.lg,
  boxSizing: 'border-box',
  overflow: 'auto',
  transition: `all ${DESIGN_TOKENS.animation.normal} ease`,
  '& > *:not(:first-child)': {
    width: { xs: '90%', sm: '65%' },
    maxWidth: '1200px',
  },
};

export const createMainContainerStyle = (
  coordinates: Coordinates | null,
  weather: WeatherInfo | null,
  location: string | null
): SxProps<Theme> => {
  const hasWeatherData = coordinates && weather && location;
  const backgroundImage = hasWeatherData
    ? getWeatherBackground(weather)
    : undefined;
  const backgroundOverlay = createBackgroundOverlay(backgroundImage);

  return {
    ...containerStyles,
    ...backgroundOverlay,
  };
};

export const formPaperStyles: SxProps<Theme> = {
  width: '100%',
  backgroundColor: `rgba(255, 255, 255, ${DESIGN_TOKENS.opacity.overlay})`,
  backdropFilter: 'blur(10px)',
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

export const formContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: DESIGN_TOKENS.spacing.md,
  padding: { xs: DESIGN_TOKENS.spacing.lg, sm: DESIGN_TOKENS.spacing.xxxl },
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
};

export const snackbarStyles: SxProps<Theme> = {
  position: 'fixed',
  zIndex: DESIGN_TOKENS.zIndex.snackbar,
  top: `${DESIGN_TOKENS.spacing.xl} !important`,
  left: '50% !important',
  transform: 'translateX(-50%)',
  width: 'auto',
  maxWidth: '90%',
  minWidth: '300px',
  '& .MuiSnackbarContent-root': {
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
  },
};

export const alertStyles: SxProps<Theme> = {
  width: '100%',
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
  boxShadow: theme => theme.shadows[DESIGN_TOKENS.elevation.lg],
};

export const createWeatherContainerStyles = (
  coordinates: Coordinates | null,
  location: string
): SxProps<Theme> => ({
  height: coordinates && location ? 'auto' : '120px',
  transition: `all ${DESIGN_TOKENS.animation.normal} ease`,
});
