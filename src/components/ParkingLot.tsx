import { useState } from 'react';
import { Box, IconButton, InputAdornment, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CloseIcon from '@mui/icons-material/Close';
import type { ParkingItem } from '../types';

interface Props {
  items: ParkingItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
}

export default function ParkingLot({ items, onAdd, onRemove }: Props) {
  const [text, setText] = useState('');

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <LocalParkingIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        <Typography variant="subtitle1" fontWeight={700}>
          Parking Lot
        </Typography>
      </Stack>
      <TextField
        fullWidth
        size="small"
        placeholder="Postpone an idea…"
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
        {items.map((item) => (
          <ListItem
            key={item.id}
            disableGutters
            sx={{ py: 0.5 }}
            secondaryAction={
              <IconButton size="small" onClick={() => onRemove(item.id)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14 }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
