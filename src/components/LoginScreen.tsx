import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import ParkIcon from '@mui/icons-material/Park';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const ok = await login(password);
    setSubmitting(false);
    if (!ok) setError(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: 4, maxWidth: 360, width: '100%' }}>
        <Stack spacing={2} alignItems="center">
          <ParkIcon sx={{ color: 'primary.main', fontSize: 36 }} />
          <Typography variant="h6" fontWeight={800}>
            Hackathon Dashboard
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ width: '100%' }}>Incorrect password</Alert>}
          <Button type="submit" variant="contained" fullWidth disabled={submitting || !password}>
            {submitting ? 'Checking…' : 'Enter'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
