import type { SxProps, Theme } from '@mui/material';
import { DESIGN_TOKENS } from './theme';
import {
  flexColumn,
  flexRow,
  roundedInput,
  spacing,
  responsive,
} from './shared';

export const containerStyles: SxProps<Theme> = {
  ...flexColumn,
  ...spacing.gap.md,
  width: '100%',
};

export const toggleButtonGroupStyles: SxProps<Theme> = {
  '& .MuiToggleButton-root': {
    borderRadius: `${DESIGN_TOKENS.borderRadius.lg} !important`,
    textTransform: 'none',
    fontWeight: 500,
  },
  ...flexRow,
  ...spacing.gap.md,
  width: '100%',
  ...responsive.flexWrap,
  justifyContent: 'center',
};

export const datePickerRowStyles: SxProps<Theme> = {
  ...flexRow,
  ...spacing.gap.md,
  width: '100%',
  flexDirection: { xs: 'column', sm: 'row' },
};

export const datePickerStyles: SxProps<Theme> = {
  width: '100%',
  ...roundedInput,
};

export const selectStyles: SxProps<Theme> = {
  ...roundedInput,
};

export const monthYearContainerStyles: SxProps<Theme> = {
  ...flexRow,
  ...spacing.gap.md,
  width: '100%',
  flexDirection: { xs: 'column', sm: 'row' },
};

export const monthYearFormControlStyles: SxProps<Theme> = {
  ...responsive.width.half,
};
