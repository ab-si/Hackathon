import { Box, Stack, Typography } from '@mui/material';
import type { Member, Task } from '../types';

interface Props {
  members: Member[];
  tasks: Task[];
}

export default function TeamWorkload({ members, tasks }: Props) {
  const rows = members.map((m) => {
    const owned = tasks.filter((t) => t.owners.some((o) => o.toLowerCase().startsWith(m.name.toLowerCase())));
    const completed = owned.filter((t) => t.status === 'Done').length;
    const active = owned.filter((t) => t.status === 'In Progress' || t.status === 'Review').length;
    return { member: m, total: owned.length, completed, active };
  });

  const max = Math.max(1, ...rows.map((r) => r.total));

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        Team Workload
      </Typography>
      <Stack spacing={1.5}>
        {rows.map((r) => (
          <Box key={r.member.id}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {r.member.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {r.completed} done &middot; {r.active} active &middot; {r.total} total
              </Typography>
            </Stack>
            <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', bgcolor: 'action.hover' }}>
              <Box
                sx={{
                  width: `${(r.completed / max) * 100}%`,
                  bgcolor: 'success.main',
                  transition: 'width .3s',
                }}
              />
              <Box
                sx={{
                  width: `${(r.active / max) * 100}%`,
                  bgcolor: 'info.main',
                  transition: 'width .3s',
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
