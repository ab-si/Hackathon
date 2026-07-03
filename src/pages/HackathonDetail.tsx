import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import confetti from 'canvas-confetti';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Hackathon, ParkingItem, Priority, Task, Win } from '../types';
import {
  apiCreateTask,
  apiDeleteParkingItem,
  apiFetchHackathon,
  apiFetchParkingLot,
  apiFetchTasks,
  apiFetchWins,
  apiPatchTask,
  apiPostParkingItem,
  apiPostWin,
} from '../api';
import Header from '../components/Header';
import TeamMembers from '../components/TeamMembers';
import Timeline from '../components/Timeline';
import TaskBoard from '../components/TaskBoard';
import TeamWorkload from '../components/TeamWorkload';
import WinsToday from '../components/WinsToday';
import ParkingLot from '../components/ParkingLot';
import HackathonFormDialog from '../components/hackathon/HackathonFormDialog';

const cardSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 1.5,
  height: '100%',
};

interface AddTaskDialogProps {
  open: boolean;
  participants: Hackathon['participants'];
  onClose: () => void;
  onAdd: (data: { title: string; primaryOwner: string; secondaryOwners: string[]; priority: Priority }) => void;
}

function AddTaskDialog({ open, participants, onClose, onAdd }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [primaryOwner, setPrimaryOwner] = useState('');
  const [secondaryOwners, setSecondaryOwners] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>('Medium');

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), primaryOwner, secondaryOwners, priority });
    setTitle('');
    setPrimaryOwner('');
    setSecondaryOwners([]);
    setPriority('Medium');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            fullWidth
          />
          <Select
            size="small"
            value={primaryOwner}
            onChange={(e) => {
              const value = e.target.value;
              setPrimaryOwner(value);
              setSecondaryOwners((prev) => prev.filter((o) => o !== value));
            }}
            displayEmpty
          >
            <MenuItem value="">Primary owner: Unassigned</MenuItem>
            {participants.map((p) => (
              <MenuItem key={p.id} value={p.name}>
                Primary: {p.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            multiple
            value={secondaryOwners}
            onChange={(e) => {
              const value = e.target.value;
              setSecondaryOwners(typeof value === 'string' ? value.split(',') : value);
            }}
            displayEmpty
            renderValue={(selected) =>
              selected.length === 0 ? (
                <Typography variant="body2" color="text.secondary" component="span">
                  Secondary owners
                </Typography>
              ) : (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {selected.map((name) => (
                    <Chip key={name} label={name} size="small" />
                  ))}
                </Stack>
              )
            }
          >
            {participants
              .filter((p) => p.name !== primaryOwner)
              .map((p) => (
                <MenuItem key={p.id} value={p.name}>
                  {p.name}
                </MenuItem>
              ))}
          </Select>
          <Select size="small" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!title.trim()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface Props {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function HackathonDetail({ darkMode, onToggleDarkMode }: Props) {
  const { hackathonId } = useParams<{ hackathonId: string }>();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const [tasks, setTasks] = useLocalStorage<Task[]>(`hackathon-${hackathonId}-tasks`, []);
  const [wins, setWins] = useLocalStorage<Win[]>(`hackathon-${hackathonId}-wins`, []);
  const [parkingLot, setParkingLot] = useLocalStorage<ParkingItem[]>(`hackathon-${hackathonId}-parking-lot`, []);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const winInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hackathonId) return;
    setNotFound(false);
    apiFetchHackathon(hackathonId)
      .then((h) => {
        setHackathon(h);
        return Promise.all([apiFetchTasks(hackathonId), apiFetchWins(hackathonId), apiFetchParkingLot(hackathonId)]);
      })
      .then(([apiTasks, apiWins, apiParkingLot]) => {
        setTasks(apiTasks);
        setWins(apiWins);
        setParkingLot(apiParkingLot);
        setApiConnected(true);
      })
      .catch(() => {
        setApiConnected(false);
        setNotFound(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId]);

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
      if (apiConnected && hackathonId) apiPatchTask(hackathonId, id, patch).catch(() => setApiConnected(false));
    },
    [setTasks, apiConnected, hackathonId],
  );

  const addTask = useCallback(
    (data: { title: string; primaryOwner: string; secondaryOwners: string[]; priority: Priority }) => {
      if (!hackathonId) return;
      if (apiConnected) {
        apiCreateTask(hackathonId, data)
          .then((task) => setTasks((prev) => [...prev, task]))
          .catch(() => setApiConnected(false));
      } else {
        setTasks((prev) => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            title: data.title,
            primaryOwner: data.primaryOwner,
            secondaryOwners: data.secondaryOwners,
            priority: data.priority,
            status: 'Todo',
            progress: 0,
            notes: '',
            updatedAt: Date.now(),
          },
        ]);
      }
    },
    [setTasks, apiConnected, hackathonId],
  );

  const addWin = useCallback(
    (text: string) => {
      if (!hackathonId) return;
      if (apiConnected) {
        apiPostWin(hackathonId, text)
          .then((win) => setWins((prev) => [win, ...prev]))
          .catch(() => {
            setApiConnected(false);
            setWins((prev) => [{ id: `w-${Date.now()}`, text, time: Date.now() }, ...prev]);
          });
      } else {
        setWins((prev) => [{ id: `w-${Date.now()}`, text, time: Date.now() }, ...prev]);
      }
    },
    [setWins, apiConnected, hackathonId],
  );

  const addParkingItem = useCallback(
    (text: string) => {
      if (!hackathonId) return;
      if (apiConnected) {
        apiPostParkingItem(hackathonId, text)
          .then((item) => setParkingLot((prev) => [...prev, item]))
          .catch(() => {
            setApiConnected(false);
            setParkingLot((prev) => [...prev, { id: `local-${Date.now()}`, text }]);
          });
      } else {
        setParkingLot((prev) => [...prev, { id: `local-${Date.now()}`, text }]);
      }
    },
    [setParkingLot, apiConnected, hackathonId],
  );

  const removeParkingItem = useCallback(
    (id: string) => {
      setParkingLot((prev) => prev.filter((item) => item.id !== id));
      if (apiConnected && hackathonId) apiDeleteParkingItem(hackathonId, id).catch(() => setApiConnected(false));
    },
    [setParkingLot, apiConnected, hackathonId],
  );

  const exportJson = useCallback(() => {
    const data = { hackathon, tasks, wins, parkingLot, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackathon-board-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [hackathon, tasks, wins, parkingLot]);

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
        onToggleDarkMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onToggleDarkMode]);

  const completedTasks = useMemo(() => tasks.filter((t) => t.status === 'Done').length, [tasks]);

  if (notFound) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          Couldn&apos;t load this hackathon
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          It may have been removed, the link is incorrect, or the server is unreachable.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to all hackathons
        </Button>
      </Container>
    );
  }

  if (!hackathon) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="text.secondary">Loading hackathon…</Typography>
      </Container>
    );
  }

  return (
    <>
      <Header
        hackathon={hackathon}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        completedTasks={completedTasks}
        totalTasks={tasks.length}
        apiConnected={apiConnected}
        onBack={() => navigate('/')}
        onEdit={() => setEditOpen(true)}
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <TeamMembers members={hackathon.participants} tasks={tasks} />

          <Paper variant="outlined" sx={cardSx}>
            <Timeline milestones={hackathon.milestones} />
          </Paper>

          <Paper variant="outlined" sx={cardSx}>
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mb: -1 }}>
              <Button size="small" startIcon={<AddIcon />} onClick={() => setAddTaskOpen(true)}>
                Add Task
              </Button>
              <Button size="small" startIcon={<DownloadIcon />} onClick={exportJson}>
                Export JSON
              </Button>
            </Stack>
            <TaskBoard
              tasks={tasks}
              members={hackathon.participants}
              onUpdateTask={updateTask}
              searchInputRef={searchInputRef}
            />
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={cardSx}>
                <TeamWorkload members={hackathon.participants} tasks={tasks} />
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

      <AddTaskDialog
        open={addTaskOpen}
        participants={hackathon.participants}
        onClose={() => setAddTaskOpen(false)}
        onAdd={addTask}
      />

      <HackathonFormDialog
        open={editOpen}
        mode="edit"
        initialValue={hackathon}
        onClose={() => setEditOpen(false)}
        onSaved={(h) => {
          setHackathon(h);
          setEditOpen(false);
        }}
      />
    </>
  );
}
