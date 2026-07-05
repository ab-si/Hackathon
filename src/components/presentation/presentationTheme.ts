import { useTheme } from '@mui/material/styles';
import { getTheme } from '../../theme';

export const getPresentationTheme = (mode: 'light' | 'dark') => getTheme(mode);

export const SIDEBAR_EXPANDED_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

export function getPresentationColors(dark: boolean) {
  const glassCardSx = {
    borderRadius: 3,
    border: '1px solid',
    borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
    bgcolor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(16px)',
    boxShadow: dark
      ? '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.6)'
      : '0 1px 0 rgba(255,255,255,0.8) inset, 0 20px 40px -24px rgba(15,23,42,0.16)',
  };

  const heroGradientSx = {
    backgroundImage: dark
      ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(34,211,238,0.08) 60%, transparent)'
      : 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.07) 60%, transparent)',
  };

  const gradientTextSx = {
    backgroundImage: dark
      ? 'linear-gradient(135deg, #a5b4fc, #67e8f9)'
      : 'linear-gradient(135deg, #4338ca, #0e7490)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  };

  return {
    dark,
    glassCardSx,
    heroGradientSx,
    gradientTextSx,
    mutedColor: dark ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.65)',
    subtleColor: dark ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.55)',
    faintColor: dark ? 'rgba(255,255,255,0.35)' : 'rgba(15,23,42,0.4)',
    hoverBg: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
    activeBg: dark ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.14)',
    borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
    surfaceBg: dark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.02)',
  };
}

export function usePresentationStyle() {
  const theme = useTheme();
  return getPresentationColors(theme.palette.mode === 'dark');
}
