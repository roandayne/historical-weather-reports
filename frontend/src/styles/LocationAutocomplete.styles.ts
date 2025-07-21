import type { SxProps, Theme } from '@mui/material';
import { DESIGN_TOKENS } from './theme';
import { roundedInput } from './shared';

export const autocompleteStyles: SxProps<Theme> = {
  width: '100%',
  ...roundedInput,
};

export const optionIconStyles: SxProps<Theme> = {
  mr: 2,
  color: 'text.secondary',
  fontSize: DESIGN_TOKENS.spacing.lg,
};

export const iconButtonStyles: SxProps<Theme> = {
  borderRadius: DESIGN_TOKENS.borderRadius.lg,
  padding: DESIGN_TOKENS.spacing.sm,
  '&:hover': {
    backgroundColor: 'action.hover',
  },
};
