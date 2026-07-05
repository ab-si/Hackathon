import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Markdown from 'react-markdown';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import { usePresentationStyle } from '../presentationTheme';

interface Props {
  problem: string;
  solution: string;
}

export default function ProblemSolutionSection({ problem, solution }: Props) {
  const { glassCardSx } = usePresentationStyle();
  if (!problem && !solution) return null;

  return (
    <Grid container spacing={2}>
      {problem && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1} sx={{ ...glassCardSx, p: 2.5, height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <HelpOutlineRoundedIcon fontSize="small" sx={{ color: 'warning.main' }} />
              <Typography variant="overline" color="text.secondary">
                Problem
              </Typography>
            </Stack>
            <Box sx={{ '& p': { m: 0 } }}>
              <Markdown>{problem}</Markdown>
            </Box>
          </Stack>
        </Grid>
      )}
      {solution && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1} sx={{ ...glassCardSx, p: 2.5, height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LightbulbRoundedIcon fontSize="small" sx={{ color: 'success.main' }} />
              <Typography variant="overline" color="text.secondary">
                Solution
              </Typography>
            </Stack>
            <Box sx={{ '& p': { m: 0 } }}>
              <Markdown>{solution}</Markdown>
            </Box>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}
