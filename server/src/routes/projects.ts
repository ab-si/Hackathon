import { Router } from 'express';
import { asyncHandler } from '../asyncHandler.js';
import Project, {
  type ProjectStatus,
  type IProjectLinks,
  type IProjectArchitecture,
  type IProjectHighlight,
  type IProjectImpact,
  type IProjectTeamMember,
  type IProjectNextStep,
} from '../models/Project.js';

interface HackathonParams {
  hackathonId: string;
}

const STATUSES: ProjectStatus[] = ['Planning', 'In Progress', 'Demo Ready', 'Done'];

const router = Router({ mergeParams: true });

router.get<HackathonParams>(
  '/',
  asyncHandler<HackathonParams>(async (req, res) => {
    const { hackathonId } = req.params;
    const projects = await Project.find({ hackathonId }).sort({ order: 1 }).lean();
    res.json(projects);
  }),
);

interface IncomingProject {
  projectId?: string;
  name?: string;
  oneLiner?: string;
  problem?: string;
  solution?: string;
  duration?: string;
  owner?: string;
  status?: string;
  progress?: number;
  demoReady?: boolean;
  links?: IProjectLinks;
  architecture?: IProjectArchitecture;
  screenshots?: string[];
  highlights?: IProjectHighlight[];
  technicalHighlights?: IProjectHighlight[];
  challenges?: IProjectHighlight[];
  impact?: IProjectImpact[];
  nextSteps?: IProjectNextStep[];
  team?: IProjectTeamMember[];
  tags?: string[];
  speakerNotes?: string;
}

// Drops list entries whose required label field is blank, and normalizes
// undefined optional fields — prevents both bad data and Mongoose subdocument
// validation errors (e.g. a highlight added in the UI but not filled in yet).
function cleanHighlights(items: IProjectHighlight[] | undefined): IProjectHighlight[] {
  return (items ?? [])
    .filter((h) => h && typeof h.title === 'string' && h.title.trim())
    .map((h) => ({ title: h.title.trim(), description: h.description ?? '' }));
}

function cleanImpact(items: IProjectImpact[] | undefined): IProjectImpact[] {
  return (items ?? [])
    .filter((i) => i && typeof i.label === 'string' && i.label.trim() && typeof i.value === 'string' && i.value.trim())
    .map((i) => ({ label: i.label.trim(), value: i.value.trim(), description: i.description ?? '' }));
}

function cleanNextSteps(items: IProjectNextStep[] | undefined): IProjectNextStep[] {
  return (items ?? [])
    .filter((s) => s && typeof s.title === 'string' && s.title.trim())
    .map((s) => ({ title: s.title.trim(), category: s.category ?? 'future' }));
}

function cleanTeam(items: IProjectTeamMember[] | undefined): IProjectTeamMember[] {
  return (items ?? [])
    .filter((m) => m && typeof m.name === 'string' && m.name.trim())
    .map((m) => ({ name: m.name.trim(), role: m.role ?? '', contribution: m.contribution ?? '' }));
}

router.put<HackathonParams>(
  '/',
  asyncHandler<HackathonParams>(async (req, res) => {
    const { hackathonId } = req.params;
    const body = req.body;
    if (!Array.isArray(body)) {
      res.status(400).json({ error: 'body must be an array of projects' });
      return;
    }

    const incoming = body as IncomingProject[];
    for (let i = 0; i < incoming.length; i++) {
      const p = incoming[i];
      if (!p || typeof p.name !== 'string' || !p.name.trim()) {
        res.status(400).json({ error: `project at index ${i} is missing a name` });
        return;
      }
      if (p.status !== undefined && !STATUSES.includes(p.status as ProjectStatus)) {
        res.status(400).json({ error: `project "${p.name}" has invalid status "${p.status}"` });
        return;
      }
      if (p.progress !== undefined && (typeof p.progress !== 'number' || p.progress < 0 || p.progress > 100)) {
        res.status(400).json({ error: `project "${p.name}" has invalid progress` });
        return;
      }
    }

    const docs = incoming.map((p, index) => ({
      hackathonId,
      projectId:
        p.projectId && p.projectId.trim() ? p.projectId : `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: p.name!.trim(),
      oneLiner: p.oneLiner ?? '',
      problem: p.problem ?? '',
      solution: p.solution ?? '',
      duration: p.duration ?? '',
      owner: p.owner ?? '',
      status: (p.status as ProjectStatus) ?? 'Planning',
      progress: p.progress ?? 0,
      demoReady: p.demoReady ?? false,
      links: p.links ?? {},
      architecture: p.architecture,
      screenshots: (p.screenshots ?? []).filter((s) => s && s.trim()),
      highlights: cleanHighlights(p.highlights),
      technicalHighlights: cleanHighlights(p.technicalHighlights),
      challenges: cleanHighlights(p.challenges),
      impact: cleanImpact(p.impact),
      nextSteps: cleanNextSteps(p.nextSteps),
      team: cleanTeam(p.team),
      tags: (p.tags ?? []).filter((t) => t && t.trim()),
      speakerNotes: p.speakerNotes ?? '',
      order: index,
    }));

    await Project.deleteMany({ hackathonId });
    const created = docs.length ? await Project.insertMany(docs) : [];
    res.json(created);
  }),
);

export default router;
