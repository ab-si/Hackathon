import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Project, ProjectStatus } from '../../../types';
import StringListEditor from './StringListEditor';
import TitleDescriptionListEditor from './TitleDescriptionListEditor';
import ImpactEditor from './ImpactEditor';
import NextStepsEditor from './NextStepsEditor';
import TeamEditor from './TeamEditor';
import LinksEditor from './LinksEditor';

const STATUSES: ProjectStatus[] = ['Planning', 'In Progress', 'Demo Ready', 'Done'];
const ARCHITECTURE_TYPES: NonNullable<Project['architecture']>['type'][] = ['image', 'markdown', 'mermaid', 'iframe'];

interface Props {
  open: boolean;
  initialValue: Project;
  onClose: () => void;
  onSave: (project: Project) => void;
}

export default function ProjectFormDialog({ open, initialValue, onClose, onSave }: Props) {
  const [project, setProject] = useState<Project>(initialValue);

  useEffect(() => {
    if (open) setProject(initialValue);
  }, [open, initialValue]);

  const patch = (fields: Partial<Project>) => setProject((p) => ({ ...p, ...fields }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{project.name ? `Edit "${project.name}"` : 'New Project'}</DialogTitle>
      <DialogContent dividers>
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>Basics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Project Name"
                value={project.name}
                onChange={(e) => patch({ name: e.target.value })}
                autoFocus
                fullWidth
              />
              <TextField
                label="One-line Summary"
                value={project.oneLiner}
                onChange={(e) => patch({ oneLiner: e.target.value })}
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Owner"
                  value={project.owner}
                  onChange={(e) => patch({ owner: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Duration"
                  placeholder="e.g. 4 hours"
                  value={project.duration ?? ''}
                  onChange={(e) => patch({ duration: e.target.value })}
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Select
                  size="small"
                  value={project.status}
                  onChange={(e) => patch({ status: e.target.value as ProjectStatus })}
                  sx={{ minWidth: 160 }}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
                <FormControlLabel
                  control={
                    <Switch
                      checked={project.demoReady}
                      onChange={(e) => patch({ demoReady: e.target.checked })}
                    />
                  }
                  label="Demo Ready badge"
                />
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Progress: {project.progress}%
                </Typography>
                <Slider
                  size="small"
                  value={project.progress}
                  onChange={(_, value) => patch({ progress: value as number })}
                  valueLabelDisplay="auto"
                />
              </Stack>
              <StringListEditor
                label="Tags"
                addLabel="Add tag"
                placeholder="e.g. frontend"
                items={project.tags}
                onChange={(tags) => patch({ tags })}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>Problem &amp; Solution</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Problem Statement"
                value={project.problem}
                onChange={(e) => patch({ problem: e.target.value })}
                multiline
                minRows={2}
                fullWidth
              />
              <TextField
                label="Solution"
                value={project.solution}
                onChange={(e) => patch({ solution: e.target.value })}
                multiline
                minRows={2}
                fullWidth
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>Demo Links</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LinksEditor links={project.links} onChange={(links) => patch({ links })} />
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>Architecture &amp; Screenshots</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Select
                  size="small"
                  value={project.architecture?.type ?? 'markdown'}
                  onChange={(e) =>
                    patch({
                      architecture: {
                        type: e.target.value as NonNullable<Project['architecture']>['type'],
                        content: project.architecture?.content ?? '',
                      },
                    })
                  }
                  sx={{ minWidth: 160 }}
                >
                  {ARCHITECTURE_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <TextField
                label={
                  project.architecture?.type === 'image' ? 'Image URL' : 'Content (markdown / mermaid / iframe URL)'
                }
                value={project.architecture?.content ?? ''}
                onChange={(e) =>
                  patch({ architecture: { type: project.architecture?.type ?? 'markdown', content: e.target.value } })
                }
                multiline={project.architecture?.type !== 'image'}
                minRows={3}
                fullWidth
              />
              <StringListEditor
                label="Screenshots"
                addLabel="Add screenshot URL"
                placeholder="https://..."
                items={project.screenshots}
                onChange={(screenshots) => patch({ screenshots })}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>Highlights, Technical Highlights &amp; Challenges</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <TitleDescriptionListEditor
                label="Key Highlights"
                addLabel="Add highlight"
                items={project.highlights}
                onChange={(highlights) => patch({ highlights })}
              />
              <TitleDescriptionListEditor
                label="Technical Highlights"
                addLabel="Add technical highlight"
                items={project.technicalHighlights}
                onChange={(technicalHighlights) => patch({ technicalHighlights })}
              />
              <TitleDescriptionListEditor
                label="Challenges"
                addLabel="Add challenge"
                items={project.challenges}
                onChange={(challenges) => patch({ challenges })}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>Team &amp; Impact</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <TeamEditor items={project.team} onChange={(team) => patch({ team })} />
              <ImpactEditor items={project.impact} onChange={(impact) => patch({ impact })} />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>Next Steps &amp; Presentation Script</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <NextStepsEditor items={project.nextSteps} onChange={(nextSteps) => patch({ nextSteps })} />
              <TextField
                label="Presentation Script (speaker notes, press N to toggle in Presentation Mode)"
                value={project.speakerNotes ?? ''}
                onChange={(e) => patch({ speakerNotes: e.target.value })}
                multiline
                minRows={3}
                fullWidth
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(project)} disabled={!project.name.trim()}>
          Save Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
