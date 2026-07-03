import { Box, Card, CardActionArea, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import type { HackathonSummary } from '../../types';
import { getHackathonStatus, STATUS_CHIP_COLORS, STATUS_LABELS } from '../../utils/hackathonStatus';

interface Props {
  hackathon: HackathonSummary;
  onClick: () => void;
}

export default function HackathonCard({ hackathon, onClick }: Props) {
  const status = getHackathonStatus(hackathon.date, hackathon.startHour, hackathon.endHour);
  const { total, done } = hackathon.taskStats;
  const completion = total > 0 ? Math.round((done / total) * 100) : 0;

  const dateLabel = new Date(`${hackathon.date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card variant="outlined" sx={{ borderRadius: 3.5, height: '100%' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%', p: 2.25, display: 'flex', alignItems: 'stretch' }}>
        <Stack spacing={1.25} sx={{ width: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Typography fontWeight={700} noWrap title={hackathon.name}>
              {hackathon.name}
            </Typography>
            <Chip
              size="small"
              label={STATUS_LABELS[status]}
              color={STATUS_CHIP_COLORS[status]}
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          {hackathon.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {hackathon.description}
            </Typography>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {dateLabel}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <GroupIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {hackathon.participantCount}
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ mt: 'auto' }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {total > 0 ? `${done}/${total} tasks` : 'No tasks yet'}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={completion}
              sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
            />
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
