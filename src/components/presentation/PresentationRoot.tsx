import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Container, IconButton, Stack, ThemeProvider, Tooltip, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useHackathonData } from '../../hooks/useHackathonData';
import { useNow } from '../../hooks/useNow';
import { usePresentationShortcuts } from '../../hooks/usePresentationShortcuts';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getEventBoundaries } from '../../utils/hackathonStatus';
import { MONO_FONT } from '../../theme';
import ModeToggle from '../ModeToggle';
import PresentationSidebar from './PresentationSidebar';
import { getPresentationColors, getPresentationTheme } from './presentationTheme';
import type { PresentationOutletContext } from './context';

interface Props {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PresentationRoot({ darkMode, onToggleDarkMode }: Props) {
  const { hackathonId } = useParams<{ hackathonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useMemo(() => getPresentationTheme(darkMode ? 'dark' : 'light'), [darkMode]);
  const { borderColor, mutedColor } = getPresentationColors(darkMode);

  const { hackathon, notFound, apiConnected, projects } = useHackathonData(hackathonId);
  const [demoChecklist, setDemoChecklist] = useLocalStorage<Record<string, boolean>>(
    `hackathon-${hackathonId}-demo-checklist`,
    {},
  );

  const base = `/hackathons/${hackathonId}/present`;
  const isOverview = location.pathname === base || location.pathname === `${base}/`;
  const [collapsed, setCollapsed] = useState(!isOverview);
  useEffect(() => {
    setCollapsed(!isOverview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const handler = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  const presentationStart = useRef(Date.now());
  const now = useNow(1000);
  const elapsedMs = now.getTime() - presentationStart.current;

  usePresentationShortcuts({
    onFullscreen: toggleFullscreen,
    onHome: () => navigate(base),
  });

  const toggleDemoChecked = (projectId: string) => {
    setDemoChecklist((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const context = useMemo<PresentationOutletContext | null>(
    () => (hackathon ? { hackathon, projects, apiConnected, demoChecklist, toggleDemoChecked } : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hackathon, projects, apiConnected, demoChecklist],
  );

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  if (!hackathon || !context) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">Loading presentation…</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  const { start, end } = getEventBoundaries(hackathon.date, hackathon.startHour, hackathon.endHour);
  const finished = now > end;
  const countdownLabel = now < start ? 'Starts in' : finished ? 'Wrapped up' : 'Time remaining';
  const countdownMs = now < start ? start.getTime() - now.getTime() : end.getTime() - now.getTime();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Box
          sx={{
            px: 2,
            py: 1.25,
            borderBottom: '1px solid',
            borderColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexShrink: 0,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            <Tooltip title="Back to overview (H)">
              <IconButton size="small" onClick={() => navigate(base)} sx={{ color: mutedColor }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle1" fontWeight={800} noWrap>
              {hackathon.name}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                {countdownLabel}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: MONO_FONT }}
              >
                {formatDuration(countdownMs)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Presenting for
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: MONO_FONT }}
              >
                {formatDuration(elapsedMs)}
              </Typography>
            </Box>
            <Tooltip title="Fullscreen (F)">
              <IconButton size="small" onClick={toggleFullscreen} sx={{ color: mutedColor }}>
                {fullscreen ? <FullscreenExitRoundedIcon fontSize="small" /> : <FullscreenRoundedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle dark mode">
              <IconButton size="small" onClick={onToggleDarkMode} sx={{ color: mutedColor }}>
                {darkMode ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <ModeToggle hackathonId={hackathon.id} mode="present" />
          </Stack>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <PresentationSidebar
            hackathonId={hackathon.id}
            projects={projects}
            demoChecklist={demoChecklist}
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
          />
          <Box sx={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
            <Outlet context={context} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

