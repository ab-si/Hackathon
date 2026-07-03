import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { Member, Task } from '../types';
import MemberCard from './MemberCard';

interface Props {
  members: Member[];
  tasks: Task[];
}

export default function TeamMembers({ members, tasks }: Props) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        Team
      </Typography>
      <Grid container spacing={2}>
        {members.map((m) => (
          <Grid key={m.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <MemberCard member={m} tasks={tasks} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
