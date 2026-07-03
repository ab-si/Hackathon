import { createTheme, type ThemeOptions } from '@mui/material/styles';

const shared: ThemeOptions = {
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
};

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    ...shared,
    palette: {
      mode,
      primary: { main: '#2f8f5b' },
      success: { main: '#2f8f5b' },
      info: { main: '#3b82f6' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
      background:
        mode === 'light'
          ? { default: '#f7f8f7', paper: '#ffffff' }
          : { default: '#101312', paper: '#171b1a' },
      divider: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
    },
  });
