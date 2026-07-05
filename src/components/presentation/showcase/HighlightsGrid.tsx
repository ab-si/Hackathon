import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import type { ProjectHighlight } from '../../../types';
import { usePresentationStyle } from '../presentationTheme';

interface Props {
  title?: string;
  icon?: ReactNode;
  iconColor?: string;
  highlights: ProjectHighlight[];
  oneColumn?: boolean;
}

export default function HighlightsGrid({
  title = 'Key Highlights',
  icon,
  iconColor = 'warning.main',
  highlights,
  oneColumn = false,
}: Props) {
  const { glassCardSx } = usePresentationStyle();
  if (highlights.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Grid container spacing={oneColumn ? 1.5 : 2}>
        {highlights.map((h, i) => (
          <Grid key={i} size={oneColumn ? 12 : { xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ ...glassCardSx, p: 2, height: oneColumn ? 'auto' : '100%' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                {icon ?? <StarRoundedIcon fontSize="small" sx={{ color: iconColor }} />}
                <Typography fontWeight={700}>{h.title}</Typography>
              </Stack>
              {h.description && (
                <Typography variant="body2" color="text.secondary">
                  {h.description}
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
