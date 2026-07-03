import { Box, Stack, Typography } from '@mui/material';
import type { Milestone } from '../types';
import { useNow } from '../hooks/useNow';

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

interface Props {
  milestones: Milestone[];
}

export default function Timeline({ milestones }: Props) {
  const now = useNow(30000);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...milestones].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  const currentIndex = sorted.reduce((acc, m, i) => (toMinutes(m.time) <= nowMinutes ? i : acc), -1);

  const format = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        Timeline
      </Typography>
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Stack direction="row" spacing={0} alignItems="flex-start" sx={{ minWidth: 720 }}>
          {sorted.map((m, i) => {
            const active = i === currentIndex;
            const past = i < currentIndex;
            return (
              <Box key={m.id} sx={{ flex: 1, position: 'relative', textAlign: 'center' }}>
                <Box
                  sx={{
                    height: 3,
                    bgcolor: i === 0 ? 'transparent' : past || active ? 'primary.main' : 'divider',
                    position: 'absolute',
                    top: 7,
                    left: '-50%',
                    width: i === 0 ? 0 : '100%',
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    width: active ? 18 : 14,
                    height: active ? 18 : 14,
                    borderRadius: '50%',
                    bgcolor: active ? 'primary.main' : past ? 'primary.main' : 'background.paper',
                    border: '2px solid',
                    borderColor: active || past ? 'primary.main' : 'divider',
                    mx: 'auto',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: active ? '0 0 0 5px rgba(47,143,91,0.18)' : 'none',
                    transition: 'all .2s',
                  }}
                />
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, fontWeight: active ? 800 : 500 }}
                  color={active ? 'primary.main' : 'text.secondary'}
                >
                  {format(m.time)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: active ? 700 : 500 }}
                  color={active ? 'text.primary' : 'text.secondary'}
                >
                  {m.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
