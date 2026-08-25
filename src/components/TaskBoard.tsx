import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import type { Member, Status, Task } from '../types';
import { isTaskOwner, PRIORITY_COLORS, STATUS_COLORS, STATUS_ORDER } from '../statusMeta';

interface Props {
  tasks: Task[];
  members: Member[];
  onUpdateTask: (id: string, patch: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function TaskBoard({ tasks, members, onUpdateTask, onEditTask, searchInputRef }: Props) {
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (ownerFilter !== 'All' && !isTaskOwner(t, ownerFilter)) return false;
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      return true;
    });
  }, [tasks, search, ownerFilter, statusFilter]);

  const setStatus = (t: Task, status: Status) => {
    const patch: Partial<Task> = { status, updatedAt: Date.now() };
    if (status === 'Done') patch.progress = 100;
    if (status === 'In Progress' && t.progress === 0) patch.progress = 10;
    onUpdateTask(t.id, patch);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }} flexWrap="wrap" gap={1}>
        <Typography variant="subtitle1" fontWeight={700}>
          Task Board
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <TextField
            inputRef={searchInputRef}
            size="small"
            placeholder="Search tasks… ( / )"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 220 }}
          />
          <Select size="small" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} sx={{ minWidth: 130 }}>
            <MenuItem value="All">All owners</MenuItem>
            {members.map((m) => (
              <MenuItem key={m.id} value={m.name}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
          <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130 }}>
            <MenuItem value="All">All statuses</MenuItem>
            {STATUS_ORDER.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      <TableContainer sx={{ borderRadius: 1.25, border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, color: 'text.secondary', bgcolor: 'action.hover' } }}>
              <TableCell sx={{ minWidth: 200 }}>Task</TableCell>
              <TableCell sx={{ minWidth: 160 }}>Owner(s)</TableCell>
              <TableCell sx={{ minWidth: 90 }}>Priority</TableCell>
              <TableCell sx={{ minWidth: 140 }}>Status</TableCell>
              <TableCell sx={{ minWidth: 140 }}>Progress</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Notes</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Quick actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {t.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {t.primaryOwner && (
                      <Chip
                        label={t.primaryOwner}
                        size="small"
                        color="primary"
                        title="Primary owner"
                      />
                    )}
                    {(t.secondaryOwners ?? []).map((o) => (
                      <Chip key={o} label={o} size="small" variant="outlined" />
                    ))}
                    {!t.primaryOwner && (t.secondaryOwners ?? []).length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Unassigned
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t.priority}
                    size="small"
                    sx={{
                      bgcolor: `${PRIORITY_COLORS[t.priority]}1f`,
                      color: PRIORITY_COLORS[t.priority],
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={t.status}
                    onChange={(e) => setStatus(t, e.target.value as Status)}
                    sx={{
                      minWidth: 128,
                      '& .MuiSelect-select': { py: 0.5, fontWeight: 700, color: STATUS_COLORS[t.status] },
                    }}
                  >
                    {STATUS_ORDER.map((s) => (
                      <MenuItem key={s} value={s} sx={{ color: STATUS_COLORS[s], fontWeight: 600 }}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Slider
                      size="small"
                      value={t.progress}
                      onChange={(_, v) => onUpdateTask(t.id, { progress: v as number, updatedAt: Date.now() })}
                      sx={{ width: 80 }}
                    />
                    <Typography variant="caption" sx={{ width: 32 }} color="text.secondary">
                      {t.progress}%
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Add note…"
                    defaultValue={t.notes}
                    onBlur={(e) => {
                      if (e.target.value !== t.notes) onUpdateTask(t.id, { notes: e.target.value, updatedAt: Date.now() });
                    }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.25}>
                    <Tooltip title="Edit task">
                      <IconButton size="small" onClick={() => onEditTask(t)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Start">
                      <IconButton size="small" onClick={() => setStatus(t, 'In Progress')}>
                        <PlayArrowIcon fontSize="small" sx={{ color: STATUS_COLORS['In Progress'] }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Review">
                      <IconButton size="small" onClick={() => setStatus(t, 'Review')}>
                        <RateReviewIcon fontSize="small" sx={{ color: STATUS_COLORS.Review }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Complete">
                      <IconButton size="small" onClick={() => setStatus(t, 'Done')}>
                        <CheckCircleIcon fontSize="small" sx={{ color: STATUS_COLORS.Done }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Block">
                      <IconButton size="small" onClick={() => setStatus(t, 'Blocked')}>
                        <BlockIcon fontSize="small" sx={{ color: STATUS_COLORS.Blocked }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    No tasks match your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
