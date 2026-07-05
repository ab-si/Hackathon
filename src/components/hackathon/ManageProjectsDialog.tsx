import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { Project, Task } from '../../types';
import { DEFAULT_PROJECTS } from '../../data/defaults';
import { PROJECT_STATUS_CHIP_COLORS } from '../../statusMeta';
import { validateProjectsJson } from '../../utils/projectValidation';
import { mergeProjectsFromTasks } from '../../utils/projectFromTasks';
import ProjectFormDialog from './project-editor/ProjectFormDialog';

interface Props {
  open: boolean;
  projects: Project[];
  tasks: Task[];
  onClose: () => void;
  onSave: (projects: Project[]) => void | Promise<void>;
}

function blankProject(): Project {
  return {
    id: `p-${Date.now()}`,
    name: '',
    oneLiner: '',
    problem: '',
    solution: '',
    owner: '',
    status: 'Planning',
    progress: 0,
    demoReady: false,
    links: {},
    screenshots: [],
    highlights: [],
    technicalHighlights: [],
    challenges: [],
    impact: [],
    nextSteps: [],
    team: [],
    tags: [],
    speakerNotes: '',
  };
}

export default function ManageProjectsDialog({ open, projects, tasks, onClose, onSave }: Props) {
  const [tab, setTab] = useState<'list' | 'json'>('list');
  const [draft, setDraft] = useState<Project[]>([]);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(projects);
      setJsonText(JSON.stringify(projects, null, 2));
      setError(null);
      setTab('list');
    }
  }, [open, projects]);

  const switchTab = (next: 'list' | 'json') => {
    if (tab === 'json' && next === 'list') {
      const result = validateProjectsJson(jsonText);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setDraft(result.projects);
      setError(null);
    } else if (tab === 'list' && next === 'json') {
      setJsonText(JSON.stringify(draft, null, 2));
    }
    setTab(next);
  };

  const loadExamples = () => {
    setDraft(DEFAULT_PROJECTS);
    setJsonText(JSON.stringify(DEFAULT_PROJECTS, null, 2));
    setError(null);
  };

  const generateFromTasks = () => {
    const next = mergeProjectsFromTasks(draft, tasks);
    setDraft(next);
    setJsonText(JSON.stringify(next, null, 2));
    setError(null);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentation-projects-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeProject = (id: string) => {
    setDraft((prev) => prev.filter((p) => p.id !== id));
  };

  const moveProject = (index: number, direction: -1 | 1) => {
    setDraft((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const saveEditedProject = (project: Project) => {
    setDraft((prev) => {
      const exists = prev.some((p) => p.id === project.id);
      return exists ? prev.map((p) => (p.id === project.id ? project : p)) : [...prev, project];
    });
    setEditingProject(null);
  };

  const submit = async () => {
    let finalProjects = draft;
    if (tab === 'json') {
      const result = validateProjectsJson(jsonText);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      finalProjects = result.projects;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave(finalProjects);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Manage Projects</DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={(_, v) => switchTab(v)} sx={{ mb: 2 }}>
            <Tab value="list" label="Projects" />
            <Tab value="json" label="Advanced (JSON)" />
          </Tabs>

          {tab === 'list' ? (
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                These projects power Presentation Mode. Edit a project's full details (problem, solution,
                links, screenshots, highlights, team, impact...) with the form, generate a starting point
                from your task board, or load example projects.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setEditingProject(blankProject())}>
                  Add Project
                </Button>
                <Button size="small" variant="outlined" onClick={generateFromTasks} disabled={tasks.length === 0}>
                  Generate from Tasks
                </Button>
                <Button size="small" onClick={loadExamples}>
                  Load Example Projects
                </Button>
                <Button size="small" onClick={downloadJson}>
                  Download JSON
                </Button>
              </Stack>

              <Stack spacing={1}>
                {draft.map((project, index) => (
                  <Stack
                    key={project.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                  >
                    <Stack spacing={0}>
                      <IconButton
                        size="small"
                        onClick={() => moveProject(index, -1)}
                        disabled={index === 0}
                        sx={{ p: 0.25 }}
                      >
                        <ArrowUpwardIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => moveProject(index, 1)}
                        disabled={index === draft.length - 1}
                        sx={{ p: 0.25 }}
                      >
                        <ArrowDownwardIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={700} noWrap>
                          {project.name || 'Untitled project'}
                        </Typography>
                        <Chip
                          size="small"
                          label={project.status}
                          color={PROJECT_STATUS_CHIP_COLORS[project.status]}
                          variant="outlined"
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" noWrap component="div">
                        {project.owner || 'Unassigned'} {project.oneLiner && `· ${project.oneLiner}`}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{ height: 4, borderRadius: 2, mt: 0.5, maxWidth: 200 }}
                      />
                    </Box>
                    <Tooltip title="Edit project">
                      <IconButton size="small" onClick={() => setEditingProject(project)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete project">
                      <IconButton size="small" onClick={() => removeProject(project.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
                {draft.length === 0 && (
                  <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    No projects yet. Add one, generate from your tasks, or load the examples above.
                  </Typography>
                )}
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                Raw JSON escape hatch — useful for bulk edits or importing a backup. Switching back to the
                Projects tab validates and applies this JSON.
              </Typography>
              <TextField
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setError(null);
                }}
                multiline
                minRows={16}
                maxRows={28}
                fullWidth
                spellCheck={false}
                slotProps={{ htmlInput: { style: { fontFamily: 'monospace', fontSize: '0.8rem' } } }}
              />
            </Stack>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={submit} disabled={saving}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {editingProject && (
        <ProjectFormDialog
          open={Boolean(editingProject)}
          initialValue={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={saveEditedProject}
        />
      )}
    </>
  );
}
