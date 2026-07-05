import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Props {
  hackathonId: string;
  mode: 'work' | 'present';
}

export default function ModeToggle({ hackathonId, mode }: Props) {
  const navigate = useNavigate();

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={mode}
      onChange={(_, value: 'work' | 'present' | null) => {
        if (!value || value === mode) return;
        navigate(value === 'present' ? `/hackathons/${hackathonId}/present` : `/hackathons/${hackathonId}`);
      }}
      sx={{ '& .MuiToggleButton-root': { px: 1.5, py: 0.25, fontSize: '0.75rem', fontWeight: 700 } }}
    >
      <ToggleButton value="work">Work Mode</ToggleButton>
      <ToggleButton value="present">Presentation Mode</ToggleButton>
    </ToggleButtonGroup>
  );
}
