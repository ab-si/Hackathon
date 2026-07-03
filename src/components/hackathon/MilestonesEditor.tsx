import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { Milestone } from '../../types';

interface Props {
  milestones: Milestone[];
  onChange: (milestones: Milestone[]) => void;
}

export default function MilestonesEditor({ milestones, onChange }: Props) {
  const update = (index: number, patch: Partial<Milestone>) => {
    onChange(milestones.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  };

  const remove = (index: number) => {
    onChange(milestones.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...milestones, { id: `m-${Date.now()}`, time: '12:00', label: '' }]);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Milestones
      </Typography>
      <Stack spacing={1}>
        {milestones.map((m, i) => (
          <Stack key={m.id} direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              type="time"
              value={m.time}
              onChange={(e) => update(i, { time: e.target.value })}
              sx={{ width: 130 }}
            />
            <TextField
              size="small"
              placeholder="Label"
              value={m.label}
              onChange={(e) => update(i, { label: e.target.value })}
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={() => remove(i)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button size="small" startIcon={<AddIcon />} onClick={add} sx={{ mt: 1 }}>
        Add milestone
      </Button>
    </Box>
  );
}
