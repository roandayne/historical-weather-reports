import type { SxProps, Theme } from '@mui/material';
import { DESIGN_TOKENS } from './theme';
import { flexColumn, flexRow, centeredText, spacing } from './shared';

export const containerStyles: SxProps<Theme> = {
  ...flexColumn,
  alignItems: 'center',
  ...spacing.gap.xl,
  color: 'text.primary',
  padding: DESIGN_TOKENS.spacing.lg,
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
  backgroundColor: 'transparent',
};

export const titleStyles: SxProps<Theme> = {
  ...centeredText,
  fontWeight: 500,
  fontSize: { xs: '1.1rem', sm: '1.25rem' },
  marginBottom: DESIGN_TOKENS.spacing.sm,
  color: 'text.primary',
};

export const weatherDataContainerStyles: SxProps<Theme> = {
  ...flexRow,
  justifyContent: 'center',
  flexWrap: 'wrap',
  ...spacing.gap.xxl,
};

export const weatherItemStyles: SxProps<Theme> = {
  ...flexRow,
  alignItems: 'center',
  ...spacing.gap.sm,
  cursor: 'default',
  padding: DESIGN_TOKENS.spacing.sm,
  borderRadius: DESIGN_TOKENS.borderRadius.md,
  backgroundColor: 'transparent',
  transition: `all ${DESIGN_TOKENS.animation.fast} ease`,
};

export const iconStyles: SxProps<Theme> = {
  fontSize: 24,
  color: 'primary.main',
};
