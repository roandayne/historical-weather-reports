import type { SxProps, Theme } from '@mui/material';
import { DESIGN_TOKENS } from './theme';

export const flexCenter: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const flexColumn: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
};

export const flexRow: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
};

export const flexBetween: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const pageContainer: SxProps<Theme> = {
  ...flexColumn,
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
};

export const contentContainer: SxProps<Theme> = {
  width: { xs: '90%', sm: '65%' },
  maxWidth: '1200px',
};

export const formContainer: SxProps<Theme> = {
  ...flexColumn,
  gap: DESIGN_TOKENS.spacing.md,
  padding: { xs: DESIGN_TOKENS.spacing.lg, sm: DESIGN_TOKENS.spacing.xxxl },
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
};

export const glassCard: SxProps<Theme> = {
  backgroundColor: `rgba(255, 255, 255, ${DESIGN_TOKENS.opacity.overlay})`,
  backdropFilter: 'blur(10px)',
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

export const elevatedCard: SxProps<Theme> = {
  backgroundColor: 'background.paper',
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
  boxShadow: theme => theme.shadows[DESIGN_TOKENS.elevation.md],
};

export const roundedInput: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
  },
  '& .MuiInputBase-root': {
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
  },
  '& fieldset': {
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
  },
};

export const createBackgroundOverlay = (
  imageUrl?: string,
  fallbackColor = '#87CEEB'
): SxProps<Theme> => ({
  backgroundImage: imageUrl
    ? `linear-gradient(rgba(255, 255, 255, ${DESIGN_TOKENS.opacity.high}), rgba(255, 255, 255, ${DESIGN_TOKENS.opacity.high})), url("${imageUrl}")`
    : undefined,
  backgroundColor: imageUrl ? undefined : fallbackColor,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
});

export const centeredText: SxProps<Theme> = {
  textAlign: 'center',
};

export const responsiveText: SxProps<Theme> = {
  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
  lineHeight: 1.5,
};

export const spacing = {
  gap: {
    xs: { gap: DESIGN_TOKENS.spacing.xs },
    sm: { gap: DESIGN_TOKENS.spacing.sm },
    md: { gap: DESIGN_TOKENS.spacing.md },
    lg: { gap: DESIGN_TOKENS.spacing.lg },
    xl: { gap: DESIGN_TOKENS.spacing.xl },
    xxl: { gap: DESIGN_TOKENS.spacing.xxl },
    xxxl: { gap: DESIGN_TOKENS.spacing.xxxl },
  },
  padding: {
    xs: { padding: DESIGN_TOKENS.spacing.xs },
    sm: { padding: DESIGN_TOKENS.spacing.sm },
    md: { padding: DESIGN_TOKENS.spacing.md },
    lg: { padding: DESIGN_TOKENS.spacing.lg },
    xl: { padding: DESIGN_TOKENS.spacing.xl },
    xxl: { padding: DESIGN_TOKENS.spacing.xxl },
    xxxl: { padding: DESIGN_TOKENS.spacing.xxxl },
  },
  margin: {
    xs: { margin: DESIGN_TOKENS.spacing.xs },
    sm: { margin: DESIGN_TOKENS.spacing.sm },
    md: { margin: DESIGN_TOKENS.spacing.md },
    lg: { margin: DESIGN_TOKENS.spacing.lg },
    xl: { margin: DESIGN_TOKENS.spacing.xl },
    xxl: { margin: DESIGN_TOKENS.spacing.xxl },
    xxxl: { margin: DESIGN_TOKENS.spacing.xxxl },
  },
} as const;

export const transitions = {
  fast: { transition: `all ${DESIGN_TOKENS.animation.fast} ease` },
  normal: { transition: `all ${DESIGN_TOKENS.animation.normal} ease` },
  slow: { transition: `all ${DESIGN_TOKENS.animation.slow} ease` },
} as const;

export const responsive = {
  flexWrap: { flexWrap: { xs: 'wrap', sm: 'nowrap' } },
  direction: {
    column: { flexDirection: { xs: 'column', sm: 'row' } },
    row: { flexDirection: { xs: 'row', sm: 'column' } },
  },
  width: {
    full: { width: '100%' },
    half: { width: { xs: '100%', sm: '50%' } },
    third: { width: { xs: '100%', sm: '33.333%' } },
    quarter: { width: { xs: '100%', sm: '25%' } },
  },
} as const;
