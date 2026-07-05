import { useOutletContext } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Container from '@mui/material/Container';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import CommitRoundedIcon from '@mui/icons-material/CommitRounded';
import MergeRoundedIcon from '@mui/icons-material/MergeRounded';
import { MONO_FONT } from '../../theme';
import { getEventBoundaries } from '../../utils/hackathonStatus';
import { usePresentationStyle } from './presentationTheme';
import type { PresentationOutletContext } from './context';

function BigStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  const { glassCardSx, gradientTextSx } = usePresentationStyle();
  return (
    <Box sx={{ ...glassCardSx, p: 3, textAlign: 'center', height: '100%' }}>
      <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
      <Typography variant="h3" fontWeight={800} sx={{ ...gradientTextSx, fontFamily: MONO_FONT }}>
        {value}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function PresentationSummary() {
  const { gradientTextSx, glassCardSx } = usePresentationStyle();
  const { hackathon, projects } = useOutletContext<PresentationOutletContext>();

  const projectsDelivered = projects.filter((p) => p.status === 'Done').length;
  const features = projects.reduce((s, p) => s + p.highlights.length, 0);
  const designs = projects.filter((p) => p.links.figma).length;
  const developers = hackathon.participants.length;
  const { start, end } = getEventBoundaries(hackathon.date, hackathon.startHour, hackathon.endHour);
  const hours = Math.round(((end.getTime() - start.getTime()) / 3600000) * 10) / 10;

  const roadmap = projects.flatMap((p) => p.nextSteps.map((s) => ({ project: p.name, ...s })));

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 5 }}>
        <Typography variant="h3" fontWeight={800} sx={gradientTextSx}>
          {hackathon.name} — Wrap Up
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400}>
          What the team shipped today
        </Typography>
      </Stack>

      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <BigStat icon={<RocketLaunchRoundedIcon fontSize="large" />} label="Projects Delivered" value={projectsDelivered} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <BigStat icon={<BoltRoundedIcon fontSize="large" />} label="Features" value={features} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <BigStat icon={<DesignServicesRoundedIcon fontSize="large" />} label="Designs" value={designs} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <BigStat icon={<GroupRoundedIcon fontSize="large" />} label="Developers" value={developers} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <BigStat icon={<ScheduleRoundedIcon fontSize="large" />} label="Hours" value={hours} />
        </Grid>
        {hackathon.summaryStats.commits !== undefined && (
          <Grid size={{ xs: 6, md: 3 }}>
            <BigStat icon={<CommitRoundedIcon fontSize="large" />} label="Commits" value={hackathon.summaryStats.commits} />
          </Grid>
        )}
        {hackathon.summaryStats.prs !== undefined && (
          <Grid size={{ xs: 6, md: 3 }}>
            <BigStat icon={<MergeRoundedIcon fontSize="large" />} label="Pull Requests" value={hackathon.summaryStats.prs} />
          </Grid>
        )}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="overline" color="text.secondary">
            Future Roadmap
          </Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {roadmap.length === 0 && (
              <Typography color="text.secondary">No next steps recorded yet.</Typography>
            )}
            {roadmap.map((item, i) => (
              <Box key={i} sx={{ ...glassCardSx, p: 1.5 }}>
                <Typography variant="body2">{item.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.project}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="overline" color="text.secondary">
            Key Learnings
          </Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {hackathon.keyLearnings.length === 0 && (
              <Typography color="text.secondary">No key learnings recorded yet.</Typography>
            )}
            {hackathon.keyLearnings.map((item, i) => (
              <Box key={i} sx={{ ...glassCardSx, p: 1.5 }}>
                <Typography variant="body2">{item}</Typography>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
