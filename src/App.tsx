import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Button, Container, CssBaseline, Paper, Stack, ThemeProvider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DownloadIcon from '@mui/icons-material/Download';
import confetti from 'canvas-confetti';
import { getTheme } from './theme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_PARKING_LOT, INITIAL_TASKS, MEMBERS, MILESTONES } from './data/initialData';
import type { Task, Win } from './types';
import Header from './components/Header';
import TeamMembers from './components/TeamMembers';
import Timeline from './components/Timeline';
import TaskBoard from './components/TaskBoard';
import TeamWorkload from './components/TeamWorkload';
import WinsToday from './components/WinsToday';
import ParkingLot from './components/ParkingLot';

const cardSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 3.5,
  height: '100%',
};

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage('hackathon-dark-mode', false);
  const [tasks, setTasks] = useLocalStorage<Task[]>('hackathon-tasks', INITIAL_TASKS);
  const [wins, setWins] = useLocalStorage<Win[]>('hackathon-wins', []);
  const [parkingLot, setParkingLot] = useLocalStorage<string[]>('hackathon-parking-lot', INITIAL_PARKING_LOT);

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const winInputRef = useRef<HTMLInputElement>(null);

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          if (patch.status === 'Done' && t.status !== 'Done') {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          }
          return { ...t, ...patch };
        }),
      );
    },
    [setTasks],
  );

  const addWin = useCallback(
    (text: string) => {
      setWins((prev) => [{ id: `w-${Date.now()}`, text, time: Date.now() }, ...prev]);
    },
    [setWins],
  );

  const addParkingItem = useCallback(
    (text: string) => {
      setParkingLot((prev) => [...prev, text]);
    },
    [setParkingLot],
  );

  const removeParkingItem = useCallback(
    (index: number) => {
      setParkingLot((prev) => prev.filter((_, i) => i !== index));
    },
    [setParkingLot],
  );

  const exportJson = useCallback(() => {
    const data = { tasks, wins, parkingLot, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackathon-board-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks, wins, parkingLot]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;
      if (isTyping) return;

      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        winInputRef.current?.focus();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setDarkMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setDarkMode]);

  const completedTasks = tasks.filter((t) => t.status === 'Done').length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((p) => !p)}
        completedTasks={completedTasks}
        totalTasks={tasks.length}
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <TeamMembers members={MEMBERS} tasks={tasks} />

          <Paper variant="outlined" sx={cardSx}>
            <Timeline milestones={MILESTONES} />
          </Paper>

          <Paper variant="outlined" sx={cardSx}>
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: -1 }}>
              <Button size="small" startIcon={<DownloadIcon />} onClick={exportJson}>
                Export JSON
              </Button>
            </Stack>
            <TaskBoard tasks={tasks} members={MEMBERS} onUpdateTask={updateTask} searchInputRef={searchInputRef} />
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={cardSx}>
                <TeamWorkload members={MEMBERS} tasks={tasks} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={cardSx}>
                <WinsToday wins={wins} onAddWin={addWin} inputRef={winInputRef} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={cardSx}>
                <ParkingLot items={parkingLot} onAdd={addParkingItem} onRemove={removeParkingItem} />
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <Box sx={{ height: 24 }} />
    </ThemeProvider>
  );
}
