import { useNavigate, useOutletContext } from 'react-router-dom';
import { Box, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { motion } from 'framer-motion';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ProjectCard from './ProjectCard';
import { usePresentationStyle } from './presentationTheme';
import { MONO_FONT } from '../../theme';
import type { PresentationOutletContext } from './context';

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  const { glassCardSx } = usePresentationStyle();
  return (
    <Box sx={{ ...glassCardSx, p: 2, flex: 1, minWidth: 140 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', mb: 0.5 }}>
        {icon}
        <Typography variant="caption">{label}</Typography>
      </Stack>
      <Typography variant="h5" fontWeight={800} sx={{ fontFamily: MONO_FONT }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function PresentationOverview() {
  const { glassCardSx, gradientTextSx, heroGradientSx } = usePresentationStyle();
  const { hackathon, projects } = useOutletContext<PresentationOutletContext>();
  const navigate = useNavigate();

  const totalProjects = projects.length;
  const avgProgress = totalProjects > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / totalProjects) : 0;
  const totalFeatures = projects.reduce((s, p) => s + p.highlights.length, 0);
  const demosAvailable = projects.filter((p) => p.demoReady).length;

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box sx={{ ...heroGradientSx, borderRadius: 4, p: { xs: 3, md: 5 }, mb: 4 }}>
        <Typography variant="h3" fontWeight={800} sx={{ ...gradientTextSx, mb: 1 }}>
          {hackathon.name}
        </Typography>
        {hackathon.description && (
          <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 3, maxWidth: 720 }}>
            {hackathon.description}
          </Typography>
        )}

        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <StatTile icon={<AutoAwesomeRoundedIcon fontSize="small" />} label="Overall Progress" value={`${avgProgress}%`} />
          <StatTile icon={<FolderRoundedIcon fontSize="small" />} label="Total Projects" value={totalProjects} />
          <StatTile icon={<BoltRoundedIcon fontSize="small" />} label="Total Features" value={totalFeatures} />
          <StatTile icon={<GroupRoundedIcon fontSize="small" />} label="Participants" value={hackathon.participants.length} />
          <StatTile icon={<BoltRoundedIcon fontSize="small" />} label="Live Demos Available" value={demosAvailable} />
        </Stack>
      </Box>

      <Typography variant="overline" color="text.secondary" sx={{ pl: 0.5 }}>
        Projects
      </Typography>
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        {projects.map((project, i) => (
          <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
              style={{ height: '100%' }}
            >
              <ProjectCard project={project} onClick={() => navigate(project.id)} />
            </motion.div>
          </Grid>
        ))}
        {projects.length === 0 && (
          <Grid size={12}>
            <Box sx={{ ...glassCardSx, p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No projects yet. Add some from Work Mode's "Manage Projects" dialog.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
