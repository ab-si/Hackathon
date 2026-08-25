import { useEffect, useMemo, useRef, useState } from 'react';
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
import { useHackathonData } from '../hooks/useHackathonData';
import type { Hackathon, Priority, Task } from '../types';
import Header from '../components/Header';
import TeamMembers from '../components/TeamMembers';
import Timeline from '../components/Timeline';
import TaskBoard from '../components/TaskBoard';
import TeamWorkload from '../components/TeamWorkload';
import WinsToday from '../components/WinsToday';
import ParkingLot from '../components/ParkingLot';
import HackathonFormDialog from '../components/hackathon/HackathonFormDialog';
import ManageProjectsDialog from '../components/hackathon/ManageProjectsDialog';

const cardSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 1.5,
  height: '100%',
};

type TaskFormData = { title: string; primaryOwner: string; secondaryOwners: string[]; priority: Priority };

interface TaskFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  participants: Hackathon['participants'];
  initialValue?: Task;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
}

function TaskFormDialog({ open, mode, participants, initialValue, onClose, onSubmit }: TaskFormDialogProps) {
  const [title, setTitle] = useState('');
  const [primaryOwner, setPrimaryOwner] = useState('');
  const [secondaryOwners, setSecondaryOwners] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>('Medium');

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialValue) {
      setTitle(initialValue.title);
      setPrimaryOwner(initialValue.primaryOwner);
      setSecondaryOwners(initialValue.secondaryOwners);
      setPriority(initialValue.priority);
    } else {
      setTitle('');
      setPrimaryOwner('');
      setSecondaryOwners([]);
      setPriority('Medium');
    }
  }, [open, mode, initialValue]);

  const submit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), primaryOwner, secondaryOwners, priority });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Edit Task' : 'Add Task'}</DialogTitle>
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
          {mode === 'edit' ? 'Save' : 'Add'}
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

  const [editOpen, setEditOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [manageProjectsOpen, setManageProjectsOpen] = useState(false);

  const {
    hackathon,
    setHackathon,
    notFound,
    apiConnected,
    tasks,
    wins,
    parkingLot,
    projects,
    updateTask,
    addTask,
    addWin,
    addParkingItem,
    removeParkingItem,
    saveProjects,
  } = useHackathonData(hackathonId);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const winInputRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const data = { hackathon, tasks, wins, parkingLot, projects, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackathon-board-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        onManageProjects={() => setManageProjectsOpen(true)}
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <TeamMembers members={hackathon.participants} tasks={tasks} />

          <Paper variant="outlined" sx={cardSx}>
            <Timeline date={hackathon.date} endHour={hackathon.endHour} milestones={hackathon.milestones} />
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
              onEditTask={setEditingTask}
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

      <TaskFormDialog
        open={addTaskOpen}
        mode="create"
        participants={hackathon.participants}
        onClose={() => setAddTaskOpen(false)}
        onSubmit={addTask}
      />

      <TaskFormDialog
        open={!!editingTask}
        mode="edit"
        participants={hackathon.participants}
        initialValue={editingTask ?? undefined}
        onClose={() => setEditingTask(null)}
        onSubmit={(data) => {
          if (editingTask) updateTask(editingTask.id, { ...data, updatedAt: Date.now() });
        }}
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

      <ManageProjectsDialog
        open={manageProjectsOpen}
        projects={projects}
        tasks={tasks}
        onClose={() => setManageProjectsOpen(false)}
        onSave={async (next) => {
          await saveProjects(next);
          setManageProjectsOpen(false);
        }}
      />
    </>
  );
}
