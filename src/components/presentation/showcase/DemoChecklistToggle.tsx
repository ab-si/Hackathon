import { FormControlLabel, Switch, Typography } from '@mui/material';

interface Props {
  checked: boolean;
  onToggle: () => void;
}

export default function DemoChecklistToggle({ checked, onToggle }: Props) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onToggle} size="small" color="success" />}
      label={<Typography variant="body2">Have you shown this?</Typography>}
    />
  );
}
