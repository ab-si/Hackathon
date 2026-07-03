import { useState } from 'react';
import { Box, IconButton, InputAdornment, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { Win } from '../types';

interface Props {
  wins: Win[];
  onAddWin: (text: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function WinsToday({ wins, onAddWin, inputRef }: Props) {
  const [text, setText] = useState('');

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddWin(trimmed);
    setText('');
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <EmojiEventsIcon fontSize="small" sx={{ color: 'warning.main' }} />
        <Typography variant="subtitle1" fontWeight={700}>
          Wins Today
        </Typography>
      </Stack>
      <TextField
        inputRef={inputRef}
        fullWidth
        size="small"
        placeholder="Add a win… ( N )"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={submit} disabled={!text.trim()}>
                <AddCircleIcon fontSize="small" color={text.trim() ? 'primary' : 'disabled'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <List dense sx={{ mt: 0.5, maxHeight: 220, overflowY: 'auto' }}>
        {wins.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No wins logged yet — add the first one!
          </Typography>
        )}
        {wins
          .slice()
          .sort((a, b) => b.time - a.time)
          .map((w) => (
            <ListItem key={w.id} disableGutters sx={{ py: 0.5 }}>
              <ListItemText
                primary={w.text}
                secondary={new Date(w.time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondaryTypographyProps={{ fontSize: 12 }}
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
}
