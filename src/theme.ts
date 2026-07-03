import { createTheme, type ThemeOptions } from '@mui/material/styles';

export const MONO_FONT = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const shared: ThemeOptions = {
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 6 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: (t) => ({
        body: {
          backgroundImage:
            t.palette.mode === 'dark'
              ? 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)'
              : 'radial-gradient(rgba(15,23,42,0.06) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        },
      }),
    },
  },
};

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    ...shared,
    palette: {
      mode,
      primary: { main: '#6366f1' },
      success: { main: '#10b981' },
      info: { main: '#22d3ee' },
      warning: { main: '#f59e0b' },
      error: { main: '#f43f5e' },
      background:
        mode === 'light'
          ? { default: '#f7f7fa', paper: '#ffffff' }
          : { default: '#09090b', paper: '#111114' },
      divider: mode === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.09)',
    },
  });
