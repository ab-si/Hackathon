import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import type { Hackathon, Member, Milestone } from '../../types';
import { apiCreateHackathon, apiUpdateHackathon } from '../../api';
import { DEFAULT_END_HOUR, DEFAULT_MILESTONES, DEFAULT_START_HOUR, DEFAULT_TEAM } from '../../data/defaults';
import { formatHour } from '../../utils/hackathonStatus';
import ParticipantsEditor from './ParticipantsEditor';
import MilestonesEditor from './MilestonesEditor';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const emptyForm = {
  name: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  startHour: DEFAULT_START_HOUR,
  endHour: DEFAULT_END_HOUR,
  participants: [] as Member[],
  milestones: [] as Milestone[],
};

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initialValue?: Hackathon;
  onClose: () => void;
  onSaved: (hackathon: Hackathon) => void;
}

export default function HackathonFormDialog({ open, mode, initialValue, onClose, onSaved }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialValue) {
      setForm({
        name: initialValue.name,
        description: initialValue.description,
        date: initialValue.date,
        startHour: initialValue.startHour,
        endHour: initialValue.endHour,
        participants: initialValue.participants,
        milestones: initialValue.milestones,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, mode, initialValue]);

  const submit = async () => {
    if (!form.name.trim() || !form.date) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        date: form.date,
        startHour: form.startHour,
        endHour: form.endHour,
        participants: form.participants,
        milestones: form.milestones,
        keyLearnings: initialValue?.keyLearnings ?? [],
        summaryStats: initialValue?.summaryStats ?? {},
      };
      const result =
        mode === 'edit' && initialValue
          ? await apiUpdateHackathon(initialValue.id, payload)
          : await apiCreateHackathon(payload);
      onSaved(result);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Edit Hackathon' : 'New Hackathon'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            autoFocus
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            multiline
            minRows={2}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Select
              value={form.startHour}
              onChange={(e) => setForm((f) => ({ ...f, startHour: Number(e.target.value) }))}
              sx={{ minWidth: 130 }}
            >
              {HOURS.map((h) => (
                <MenuItem key={h} value={h}>
                  {formatHour(h)}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={form.endHour}
              onChange={(e) => setForm((f) => ({ ...f, endHour: Number(e.target.value) }))}
              sx={{ minWidth: 130 }}
            >
              {HOURS.map((h) => (
                <MenuItem key={h} value={h}>
                  {formatHour(h)}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Divider />

          <ParticipantsEditor
            participants={form.participants}
            onChange={(participants) => setForm((f) => ({ ...f, participants }))}
          />
          <Button size="small" onClick={() => setForm((f) => ({ ...f, participants: DEFAULT_TEAM }))}>
            Use default team
          </Button>

          <Divider />

          <MilestonesEditor
            milestones={form.milestones}
            onChange={(milestones) => setForm((f) => ({ ...f, milestones }))}
          />
          <Button size="small" onClick={() => setForm((f) => ({ ...f, milestones: DEFAULT_MILESTONES }))}>
            Use default agenda
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={saving || !form.name.trim() || !form.date}>
          {mode === 'edit' ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
