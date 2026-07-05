import { Avatar, Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { ProjectTeamMember } from '../../../types';
import { initials } from '../../../statusMeta';
import { usePresentationStyle } from '../presentationTheme';

interface Props {
  team: ProjectTeamMember[];
}

export default function TeamSection({ team }: Props) {
  const { glassCardSx } = usePresentationStyle();
  if (team.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" color="text.secondary">
        Team
      </Typography>
      <Grid container spacing={2}>
        {team.map((member, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ ...glassCardSx, p: 2, height: '100%' }}>
              <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>{initials(member.name)}</Avatar>
              <Box>
                <Typography fontWeight={700}>{member.name}</Typography>
                {member.role && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {member.role}
                  </Typography>
                )}
                {member.contribution && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {member.contribution}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
