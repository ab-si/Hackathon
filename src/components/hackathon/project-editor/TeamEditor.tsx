import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { ProjectTeamMember } from '../../../types';

interface Props {
  items: ProjectTeamMember[];
  onChange: (items: ProjectTeamMember[]) => void;
}

export default function TeamEditor({ items, onChange }: Props) {
  const update = (index: number, patch: Partial<ProjectTeamMember>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, { name: '', role: '', contribution: '' }]);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Team
      </Typography>
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
            <TextField
              size="small"
              placeholder="Name"
              value={item.name}
              onChange={(e) => update(i, { name: e.target.value })}
              sx={{ width: 160 }}
            />
            <TextField
              size="small"
              placeholder="Role"
              value={item.role}
              onChange={(e) => update(i, { role: e.target.value })}
              sx={{ width: 140 }}
            />
            <TextField
              size="small"
              placeholder="Contribution (optional)"
              value={item.contribution ?? ''}
              onChange={(e) => update(i, { contribution: e.target.value })}
              fullWidth
            />
            <IconButton size="small" onClick={() => remove(i)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button size="small" startIcon={<AddIcon />} onClick={add} sx={{ mt: 1 }}>
        Add team member
      </Button>
    </Box>
  );
}
