import { Button, Stack, Typography } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import type { Project } from '../../../types';

interface Props {
  currentProjectId: string;
  allProjects: Project[];
}

export default function DashboardLinksSection({ currentProjectId, allProjects }: Props) {
  const related = allProjects.filter((p) => p.id !== currentProjectId && p.links.dashboard);
  if (related.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" color="text.secondary">
        Related Dashboards
      </Typography>
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5}>
        {related.map((p) => (
          <Button
            key={p.id}
            variant="outlined"
            size="small"
            startIcon={<DashboardRoundedIcon fontSize="small" />}
            href={p.links.dashboard!}
            target="_blank"
            rel="noopener noreferrer"
          >
            {p.name} Dashboard
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
