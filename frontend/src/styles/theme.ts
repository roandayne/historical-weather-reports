import { createTheme } from '@mui/material/styles';

export const DESIGN_TOKENS = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '40px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  elevation: {
    sm: 1,
    md: 3,
    lg: 6,
    xl: 12,
  },
  animation: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },
  zIndex: {
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  opacity: {
    disabled: 0.38,
    medium: 0.6,
    high: 0.8,
    overlay: 0.9,
  },
  breakpoints: {
    mobile: '600px',
    tablet: '900px',
    desktop: '1200px',
  },
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.3,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: 'rgba(0, 0, 0, 0.6)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: DESIGN_TOKENS.borderRadius.lg,
          padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.xl}`,
          fontSize: '1rem',
          fontWeight: 500,
          transition: `all ${DESIGN_TOKENS.animation.normal} ease`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.borderRadius.lg,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.borderRadius.lg,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: `${DESIGN_TOKENS.borderRadius.lg} !important`,
        },
      },
    },
  },
});
