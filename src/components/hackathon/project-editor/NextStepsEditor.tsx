import { Box, Button, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { ProjectNextStep, ProjectNextStepCategory } from '../../../types';

const CATEGORIES: { value: ProjectNextStepCategory; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming Feature' },
  { value: 'future', label: 'Future Improvement' },
  { value: 'limitation', label: 'Known Limitation' },
  { value: 'tech-debt', label: 'Technical Debt' },
];

interface Props {
  items: ProjectNextStep[];
  onChange: (items: ProjectNextStep[]) => void;
}

export default function NextStepsEditor({ items, onChange }: Props) {
  const update = (index: number, patch: Partial<ProjectNextStep>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, { title: '', category: 'upcoming' }]);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Next Steps
      </Typography>
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              placeholder="What's next"
              value={item.title}
              onChange={(e) => update(i, { title: e.target.value })}
              sx={{ flex: 1 }}
            />
            <Select
              size="small"
              value={item.category ?? 'upcoming'}
              onChange={(e) => update(i, { category: e.target.value as ProjectNextStepCategory })}
              sx={{ minWidth: 170 }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
            <IconButton size="small" onClick={() => remove(i)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button size="small" startIcon={<AddIcon />} onClick={add} sx={{ mt: 1 }}>
        Add next step
      </Button>
    </Box>
  );
}
