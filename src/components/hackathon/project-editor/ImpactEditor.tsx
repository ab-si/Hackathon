import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { ProjectImpact } from '../../../types';

interface Props {
  items: ProjectImpact[];
  onChange: (items: ProjectImpact[]) => void;
}

export default function ImpactEditor({ items, onChange }: Props) {
  const update = (index: number, patch: Partial<ProjectImpact>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, { label: '', value: '', description: '' }]);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Impact
      </Typography>
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
            <TextField
              size="small"
              placeholder="Value (e.g. 80%)"
              value={item.value}
              onChange={(e) => update(i, { value: e.target.value })}
              sx={{ width: 140 }}
            />
            <Stack spacing={1} sx={{ flex: 1 }}>
              <TextField
                size="small"
                placeholder="Label (e.g. Search Time Reduced)"
                value={item.label}
                onChange={(e) => update(i, { label: e.target.value })}
                fullWidth
              />
              <TextField
                size="small"
                placeholder="Description (optional)"
                value={item.description ?? ''}
                onChange={(e) => update(i, { description: e.target.value })}
                fullWidth
              />
            </Stack>
            <IconButton size="small" onClick={() => remove(i)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button size="small" startIcon={<AddIcon />} onClick={add} sx={{ mt: 1 }}>
        Add impact stat
      </Button>
    </Box>
  );
}
