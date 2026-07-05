import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { ProjectNextStep, ProjectNextStepCategory } from '../../../types';
import { usePresentationStyle } from '../presentationTheme';

const CATEGORY_LABELS: Record<ProjectNextStepCategory, string> = {
  future: 'Future Improvements',
  upcoming: 'Upcoming Features',
  limitation: 'Known Limitations',
  'tech-debt': 'Technical Debt',
};

const CATEGORY_ORDER: ProjectNextStepCategory[] = ['upcoming', 'future', 'limitation', 'tech-debt'];

interface Props {
  nextSteps: ProjectNextStep[];
}

export default function NextStepsSection({ nextSteps }: Props) {
  const { glassCardSx } = usePresentationStyle();
  if (nextSteps.length === 0) return null;

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: nextSteps.filter((s) => (s.category ?? 'future') === category),
  })).filter((g) => g.items.length > 0);

  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" color="text.secondary">
        Next Steps
      </Typography>
      <Grid container spacing={2}>
        {grouped.map(({ category, items }) => (
          <Grid key={category} size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ ...glassCardSx, p: 2, height: '100%' }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                {CATEGORY_LABELS[category]}
              </Typography>
              <Stack spacing={0.75}>
                {items.map((item, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    &bull; {item.title}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
