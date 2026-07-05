import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { ProjectImpact } from '../../../types';
import { MONO_FONT } from '../../../theme';
import { usePresentationStyle } from '../presentationTheme';

interface Props {
  impact: ProjectImpact[];
}

export default function ImpactGrid({ impact }: Props) {
  const { glassCardSx, gradientTextSx } = usePresentationStyle();
  if (impact.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" color="text.secondary">
        Impact
      </Typography>
      <Grid container spacing={2}>
        {impact.map((item, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ ...glassCardSx, p: 2.5, height: '100%', textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={800} sx={{ ...gradientTextSx, fontFamily: MONO_FONT }}>
                {item.value}
              </Typography>
              <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                {item.label}
              </Typography>
              {item.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
