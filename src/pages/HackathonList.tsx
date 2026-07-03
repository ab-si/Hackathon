import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ParkIcon from '@mui/icons-material/Park';
import type { HackathonSummary } from '../types';
import { apiFetchHackathons } from '../api';
import HackathonCard from '../components/hackathon/HackathonCard';
import HackathonFormDialog from '../components/hackathon/HackathonFormDialog';

interface Props {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function HackathonList({ darkMode, onToggleDarkMode }: Props) {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState<HackathonSummary[] | null>(null);
  const [error, setError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const load = () => {
    setError(false);
    apiFetchHackathons()
      .then(setHackathons)
      .catch(() => setError(true));
  };

  useEffect(load, []);

  return (
    <Box>
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: { xs: 2, md: 4 },
          py: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ParkIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={800}>
              14 Trees Hackathons
            </Typography>
          </Stack>
          <Tooltip title="Toggle dark mode">
            <IconButton onClick={onToggleDarkMode} size="small">
              {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            All Hackathons
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            New Hackathon
          </Button>
        </Stack>

        {error && (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
            <Typography color="text.secondary">Couldn&apos;t load hackathons.</Typography>
            <Button onClick={load}>Retry</Button>
          </Stack>
        )}

        {!error && hackathons === null && (
          <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
            Loading hackathons…
          </Typography>
        )}

        {!error && hackathons !== null && hackathons.length === 0 && (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
            <Typography color="text.secondary">No hackathons yet — create the first one!</Typography>
          </Stack>
        )}

        {!error && hackathons !== null && hackathons.length > 0 && (
          <Grid container spacing={2.5}>
            {hackathons.map((h) => (
              <Grid key={h.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <HackathonCard hackathon={h} onClick={() => navigate(`/hackathons/${h.id}`)} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <HackathonFormDialog
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSaved={(h) => {
          setCreateOpen(false);
          navigate(`/hackathons/${h.id}`);
        }}
      />
    </Box>
  );
}
