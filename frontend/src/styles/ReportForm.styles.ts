import type { SxProps, Theme } from '@mui/material';
import { DESIGN_TOKENS } from './theme';
import { transitions } from './shared';

export const generateButtonStyles: SxProps<Theme> = {
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
  padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.xl}`,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  minHeight: '48px',
  ...transitions.normal,
  '&:disabled': {
    opacity: DESIGN_TOKENS.opacity.disabled,
  },
  '&:hover:not(:disabled)': {
    transform: 'translateY(-1px)',
    boxShadow: theme => theme.shadows[DESIGN_TOKENS.elevation.md],
  },
};
