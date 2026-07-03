import { Box, Chip, IconButton, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ParkIcon from '@mui/icons-material/Park';
import { useNow } from '../hooks/useNow';
import { EVENT_END_HOUR, EVENT_START_HOUR } from '../data/initialData';

function eventBoundary(now: Date, hour: number) {
  const d = new Date(now);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface Props {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  completedTasks: number;
  totalTasks: number;
  apiConnected?: boolean;
}

export default function Header({ darkMode, onToggleDarkMode, completedTasks, totalTasks, apiConnected }: Props) {
  const now = useNow();
  const start = eventBoundary(now, EVENT_START_HOUR);
  const end = eventBoundary(now, EVENT_END_HOUR);

  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = now.getTime() - start.getTime();
  const eventProgress = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  const notStarted = now < start;
  const finished = now > end;
  const countdownLabel = notStarted ? 'Starts in' : finished ? 'Wrapped up' : 'Time remaining';
  const countdownMs = notStarted ? start.getTime() - now.getTime() : end.getTime() - now.getTime();

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        bgcolor: (t) => (t.palette.mode === 'light' ? 'rgba(247,248,247,0.85)' : 'rgba(16,19,18,0.85)'),
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: { xs: 2, md: 4 },
        py: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={1.5}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ParkIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
              14 Trees Hackathon
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {dateLabel} &middot; 11:00 AM &ndash; 11:00 PM
            </Typography>
          </Box>
          {apiConnected !== undefined && (
            <Tooltip title={apiConnected ? 'Synced with MongoDB' : 'Offline — using local storage'}>
              <Chip
                size="small"
                label={apiConnected ? 'Live' : 'Offline'}
                color={apiConnected ? 'success' : 'default'}
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Tooltip>
          )}
        </Stack>

        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ minWidth: 140 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              {countdownLabel}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={700}
              sx={{ fontVariantNumeric: 'tabular-nums' }}
              color={finished ? 'text.secondary' : 'text.primary'}
            >
              {formatDuration(countdownMs)}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 160 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {completedTasks}/{totalTasks} tasks
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={eventProgress}
              sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
            />
          </Box>

          <Tooltip title="Toggle dark mode (D)">
            <IconButton onClick={onToggleDarkMode} size="small">
              {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}
