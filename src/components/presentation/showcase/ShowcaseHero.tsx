import { Box, Chip, Stack, Typography } from '@mui/material';
import type { Project } from '../../../types';
import { PROJECT_STATUS_CHIP_COLORS } from '../../../statusMeta';
import { usePresentationStyle } from '../presentationTheme';

interface Props {
  project: Project;
}

export default function ShowcaseHero({ project }: Props) {
  const { gradientTextSx, heroGradientSx } = usePresentationStyle();
  const topImpact = project.impact[0];
  const otherTeamNames = project.team.map((t) => t.name).filter((name) => name !== project.owner);

  return (
    <Box sx={{ ...heroGradientSx, borderRadius: 4, p: { xs: 3, md: 5 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Chip
          size="small"
          label={project.status}
          color={PROJECT_STATUS_CHIP_COLORS[project.status]}
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
        {project.demoReady && project.status !== 'Demo Ready' && (
          <Chip size="small" label="Demo Ready" color="success" sx={{ fontWeight: 700 }} />
        )}
        {project.tags.map((tag) => (
          <Chip key={tag} size="small" label={tag} variant="outlined" sx={{ color: 'text.secondary' }} />
        ))}
      </Stack>

      <Typography variant="h3" fontWeight={800} sx={{ ...gradientTextSx, mb: 1 }}>
        {project.name}
      </Typography>

      {project.owner && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Owned by {project.owner}
          {otherTeamNames.length > 0 && ` · ${otherTeamNames.join(', ')}`}
          {project.duration && ` · ${project.duration}`}
        </Typography>
      )}

      {project.oneLiner && (
        <Typography variant="h6" fontWeight={400} color="text.secondary" sx={{ maxWidth: 800, mb: topImpact ? 2 : 0 }}>
          {project.oneLiner}
        </Typography>
      )}

      {topImpact && (
        <Typography variant="body1" sx={{ color: 'success.light', fontWeight: 600 }}>
          {topImpact.label}: {topImpact.value}
        </Typography>
      )}
    </Box>
  );
}
