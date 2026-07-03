import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { Member } from '../../types';

interface Props {
  participants: Member[];
  onChange: (participants: Member[]) => void;
}

export default function ParticipantsEditor({ participants, onChange }: Props) {
  const update = (index: number, patch: Partial<Member>) => {
    onChange(participants.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const remove = (index: number) => {
    onChange(participants.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...participants, { id: `p-${Date.now()}`, name: '', role: '' }]);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Participants
      </Typography>
      <Stack spacing={1}>
        {participants.map((p, i) => (
          <Stack key={p.id} direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Name"
              value={p.name}
              onChange={(e) => update(i, { name: e.target.value })}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              placeholder="Role"
              value={p.role}
              onChange={(e) => update(i, { role: e.target.value })}
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={() => remove(i)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button size="small" startIcon={<AddIcon />} onClick={add} sx={{ mt: 1 }}>
        Add participant
      </Button>
    </Box>
  );
}
