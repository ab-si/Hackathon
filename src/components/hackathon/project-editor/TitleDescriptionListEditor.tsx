import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { ProjectHighlight } from '../../../types';

interface Props {
  label: string;
  addLabel: string;
  items: ProjectHighlight[];
  onChange: (items: ProjectHighlight[]) => void;
}

export default function TitleDescriptionListEditor({ label, addLabel, items, onChange }: Props) {
  const update = (index: number, patch: Partial<ProjectHighlight>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, { title: '', description: '' }]);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
            <Stack spacing={1} sx={{ flex: 1 }}>
              <TextField
                size="small"
                placeholder="Title"
                value={item.title}
                onChange={(e) => update(i, { title: e.target.value })}
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
        {addLabel}
      </Button>
    </Box>
  );
}
