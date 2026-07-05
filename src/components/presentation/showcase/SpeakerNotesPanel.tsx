import { Box, Collapse, Stack, Typography } from '@mui/material';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import Markdown from 'react-markdown';
import { usePresentationStyle } from '../presentationTheme';

interface Props {
  notes?: string;
  open: boolean;
}

export default function SpeakerNotesPanel({ notes, open }: Props) {
  const { glassCardSx } = usePresentationStyle();
  if (!notes) return null;

  return (
    <Collapse in={open}>
      <Box sx={{ ...glassCardSx, p: 2.5, borderColor: 'warning.main', borderStyle: 'dashed' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <LightbulbRoundedIcon fontSize="small" sx={{ color: 'warning.main' }} />
          <Typography variant="overline" color="warning.main">
            Presentation Script (press N to toggle)
          </Typography>
        </Stack>
        <Markdown>{notes}</Markdown>
      </Box>
    </Collapse>
  );
}
