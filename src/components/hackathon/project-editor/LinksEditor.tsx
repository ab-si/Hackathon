import { Stack, TextField } from '@mui/material';
import type { ProjectLinks } from '../../../types';

const FIELDS: { key: keyof ProjectLinks; label: string }[] = [
  { key: 'liveDemo', label: 'Live Demo URL' },
  { key: 'hosted', label: 'Hosted App URL' },
  { key: 'dashboard', label: 'Dashboard URL' },
  { key: 'figma', label: 'Figma URL' },
  { key: 'github', label: 'GitHub URL' },
  { key: 'documentation', label: 'Documentation URL' },
];

interface Props {
  links: ProjectLinks;
  onChange: (links: ProjectLinks) => void;
}

export default function LinksEditor({ links, onChange }: Props) {
  return (
    <Stack spacing={1.5}>
      {FIELDS.map((field) => (
        <TextField
          key={field.key}
          size="small"
          label={field.label}
          value={links[field.key] ?? ''}
          onChange={(e) => onChange({ ...links, [field.key]: e.target.value })}
          fullWidth
        />
      ))}
    </Stack>
  );
}
