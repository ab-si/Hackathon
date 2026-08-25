import { Box, Tooltip, Typography } from '@mui/material';
import { MONO_FONT } from '../theme';

// Injected at build time by vite.config.ts (git commit + build timestamp).
const COMMIT = __APP_COMMIT__;
const BUILD_TIME = __APP_BUILD_TIME__;

export default function VersionBadge() {
  const buildLabel = new Date(BUILD_TIME).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Tooltip title={`Built ${buildLabel} · commit ${COMMIT}`} placement="top-start">
      <Box
        sx={{
          position: 'fixed',
          bottom: 8,
          left: 8,
          zIndex: 1300,
          px: 0.75,
          py: 0.25,
          borderRadius: 1,
          bgcolor: 'action.hover',
          border: '1px solid',
          borderColor: 'divider',
          pointerEvents: 'auto',
          opacity: 0.6,
          '&:hover': { opacity: 1 },
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontFamily: MONO_FONT, color: 'text.secondary', lineHeight: 1.4 }}
        >
          {COMMIT}
        </Typography>
      </Box>
    </Tooltip>
  );
}
