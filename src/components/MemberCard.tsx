import { Avatar, Box, Card, LinearProgress, Stack, Typography } from '@mui/material';
import type { Member, Task } from '../types';
import { STATUS_COLORS, initials, timeAgo } from '../statusMeta';
import { useNow } from '../hooks/useNow';

const STATUS_PRIORITY: Record<string, number> = {
  'In Progress': 0,
  Review: 1,
  Blocked: 2,
  Todo: 3,
  Done: 4,
};

function pickCurrentTask(tasks: Task[], memberName: string): Task | null {
  const owned = tasks.filter((t) => t.owners.some((o) => o.toLowerCase().startsWith(memberName.toLowerCase())));
  if (owned.length === 0) return null;
  return [...owned].sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status])[0];
}

interface Props {
  member: Member;
  tasks: Task[];
}

export default function MemberCard({ member, tasks }: Props) {
  const now = useNow(30000);
  const task = pickCurrentTask(tasks, member.name);
  const status = task?.status ?? 'Todo';
  const color = STATUS_COLORS[status];

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        borderRadius: 3.5,
        height: '100%',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700, width: 40, height: 40 }}>
          {initials(member.name)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={700} noWrap>
            {member.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {member.role}
          </Typography>
        </Box>
      </Stack>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Current task
        </Typography>
        <Typography variant="body2" fontWeight={600} noWrap>
          {task ? task.title : 'No task assigned'}
        </Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
        <Typography variant="caption" fontWeight={700} sx={{ color }}>
          {status}
        </Typography>
      </Stack>

      <Box>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            Progress
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {task?.progress ?? 0}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={task?.progress ?? 0}
          sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
        />
      </Box>

      <Typography variant="caption" color="text.secondary">
        {task ? `Updated ${timeAgo(task.updatedAt, now.getTime())}` : '—'}
      </Typography>
    </Card>
  );
}
