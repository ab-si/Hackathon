import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import type { Project } from '../../types';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH, usePresentationStyle } from './presentationTheme';

interface Props {
  hackathonId: string;
  projects: Project[];
  demoChecklist: Record<string, boolean>;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function PresentationSidebar({ hackathonId, projects, demoChecklist, collapsed, onToggleCollapsed }: Props) {
  const { dark, mutedColor, faintColor, activeBg, hoverBg, borderColor, surfaceBg } = usePresentationStyle();
  const base = `/hackathons/${hackathonId}/present`;
  const activeTextColor = dark ? '#fff' : '#0f172a';

  const navItemSx = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    px: 1.5,
    py: 1,
    borderRadius: 2,
    color: active ? activeTextColor : mutedColor,
    bgcolor: active ? activeBg : 'transparent',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: active ? 700 : 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    transition: 'background-color .15s, color .15s',
    '&:hover': { bgcolor: hoverBg, color: activeTextColor },
  });

  return (
    <Box
      sx={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor,
        bgcolor: surfaceBg,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width .2s ease',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <Stack direction="row" justifyContent="flex-end" sx={{ p: 1 }}>
        <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <IconButton size="small" onClick={onToggleCollapsed} sx={{ color: mutedColor }}>
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack spacing={0.5} sx={{ px: 1, overflowY: 'auto', flex: 1 }}>
        <NavLink to={base} end style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <Box sx={navItemSx(isActive)}>
              <GridViewRoundedIcon fontSize="small" />
              {!collapsed && <span>Overview</span>}
            </Box>
          )}
        </NavLink>

        {!collapsed && (
          <Typography variant="overline" sx={{ color: faintColor, px: 1.5, pt: 1.5, pb: 0.25, fontSize: '0.65rem' }}>
            Projects
          </Typography>
        )}

        {projects.map((p) => (
          <NavLink key={p.id} to={`${base}/${p.id}`} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Box sx={navItemSx(isActive)}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: p.demoReady ? 'success.main' : faintColor,
                  }}
                />
                {!collapsed && (
                  <Typography noWrap sx={{ fontSize: 'inherit', fontWeight: 'inherit', flex: 1 }}>
                    {p.name}
                  </Typography>
                )}
                {!collapsed && demoChecklist[p.id] && (
                  <CheckCircleRoundedIcon sx={{ fontSize: 14, color: 'success.main' }} />
                )}
              </Box>
            )}
          </NavLink>
        ))}

        {!collapsed && (
          <Typography variant="overline" sx={{ color: faintColor, px: 1.5, pt: 1.5, pb: 0.25, fontSize: '0.65rem' }}>
            Wrap-up
          </Typography>
        )}
        <NavLink to={`${base}/summary`} style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <Box sx={navItemSx(isActive)}>
              <FlagRoundedIcon fontSize="small" />
              {!collapsed && <span>Summary</span>}
            </Box>
          )}
        </NavLink>
      </Stack>
    </Box>
  );
}
