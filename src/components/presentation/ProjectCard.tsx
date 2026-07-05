import { Avatar, Box, Card, CardActionArea, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import type { Project } from '../../types';
import { PROJECT_STATUS_CHIP_COLORS, PROJECT_STATUS_COLORS, initials } from '../../statusMeta';
import { MONO_FONT } from '../../theme';
import { usePresentationStyle } from './presentationTheme';

interface Props {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: Props) {
  const { glassCardSx, dark } = usePresentationStyle();
  const accent = PROJECT_STATUS_COLORS[project.status];

  return (
    <Card
      variant="outlined"
      sx={{
        ...glassCardSx,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: accent,
          boxShadow: dark
            ? `0 24px 48px -24px ${accent}66, 0 1px 0 rgba(255,255,255,0.04) inset`
            : `0 24px 48px -24px ${accent}55, 0 1px 0 rgba(255,255,255,0.8) inset`,
        },
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: accent }} />
      <CardActionArea onClick={onClick} sx={{ height: '100%', p: 2.5, pt: 3, display: 'flex', alignItems: 'stretch' }}>
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  bgcolor: `${accent}22`,
                  color: accent,
                  border: '1px solid',
                  borderColor: `${accent}55`,
                }}
              >
                {project.owner ? initials(project.owner) : '?'}
              </Avatar>
              <Typography fontWeight={800} noWrap title={project.name} sx={{ lineHeight: 1.2 }}>
                {project.name}
              </Typography>
            </Stack>
            <Chip
              size="small"
              label={project.status}
              color={PROJECT_STATUS_CHIP_COLORS[project.status]}
              variant="outlined"
              sx={{ fontWeight: 700, flexShrink: 0 }}
            />
          </Stack>

          {project.oneLiner && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {project.oneLiner}
            </Typography>
          )}

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            {project.highlights.length > 0 && (
              <Chip
                size="small"
                icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 14 }} />}
                label={`${project.highlights.length} highlight${project.highlights.length === 1 ? '' : 's'}`}
                variant="outlined"
                sx={{ fontWeight: 600, height: 22, '& .MuiChip-label': { px: 0.75 } }}
              />
            )}
            {project.demoReady && (
              <Chip
                size="small"
                icon={<BoltRoundedIcon sx={{ fontSize: 14 }} />}
                label="Demo Ready"
                color="success"
                variant="filled"
                sx={{ fontWeight: 700, height: 22, '& .MuiChip-label': { px: 0.75 } }}
              />
            )}
          </Stack>

          <Box sx={{ mt: 'auto', pt: 0.5 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ fontFamily: MONO_FONT, color: accent }}>
                {project.progress}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={project.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                mt: 0.5,
                bgcolor: `${accent}1a`,
                '& .MuiLinearProgress-bar': { bgcolor: accent, borderRadius: 3 },
              }}
            />
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
