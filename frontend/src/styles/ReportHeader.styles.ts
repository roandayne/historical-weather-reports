import type { SxProps, Theme } from '@mui/material';
import { DESIGN_TOKENS } from './theme';
import { flexColumn, centeredText, spacing } from './shared';

export const containerStyles: SxProps<Theme> = {
  ...flexColumn,
  alignItems: 'center',
  ...spacing.gap.lg,
  ...spacing.margin.xxl,
};

export const titleStyles: SxProps<Theme> = {
  ...centeredText,
  fontWeight: 600,
  color: 'text.primary',
  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
  lineHeight: 1.2,
  marginBottom: DESIGN_TOKENS.spacing.sm,
};

export const subtitleStyles: SxProps<Theme> = {
  ...centeredText,
  color: 'text.secondary',
  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
  lineHeight: 1.5,
  maxWidth: '600px',
};
