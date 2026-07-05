import type { Project, ProjectStatus } from '../types';

const STATUSES: ProjectStatus[] = ['Planning', 'In Progress', 'Demo Ready', 'Done'];

export function validateProjectsJson(text: string): { projects: Project[] } | { error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return { error: e instanceof Error ? `Invalid JSON: ${e.message}` : 'Invalid JSON' };
  }

  if (!Array.isArray(parsed)) {
    return { error: 'Top-level JSON must be an array of projects' };
  }

  const projects: Project[] = [];
  for (let i = 0; i < parsed.length; i++) {
    const raw = parsed[i] as Record<string, unknown>;
    if (!raw || typeof raw !== 'object') {
      return { error: `Item at index ${i} is not an object` };
    }
    if (typeof raw.name !== 'string' || !raw.name.trim()) {
      return { error: `Item at index ${i} is missing a "name" string` };
    }
    if (raw.status !== undefined && !STATUSES.includes(raw.status as ProjectStatus)) {
      return { error: `"${raw.name}" has invalid status "${String(raw.status)}" (expected one of ${STATUSES.join(', ')})` };
    }
    if (raw.progress !== undefined && (typeof raw.progress !== 'number' || raw.progress < 0 || raw.progress > 100)) {
      return { error: `"${raw.name}" has an invalid progress value (expected a number 0-100)` };
    }

    projects.push({
      id: typeof raw.id === 'string' && raw.id ? raw.id : `p-${Date.now()}-${i}`,
      name: (raw.name as string).trim(),
      oneLiner: typeof raw.oneLiner === 'string' ? raw.oneLiner : '',
      problem: typeof raw.problem === 'string' ? raw.problem : '',
      solution: typeof raw.solution === 'string' ? raw.solution : '',
      duration: typeof raw.duration === 'string' ? raw.duration : undefined,
      owner: typeof raw.owner === 'string' ? raw.owner : '',
      status: (raw.status as ProjectStatus) ?? 'Planning',
      progress: typeof raw.progress === 'number' ? raw.progress : 0,
      demoReady: Boolean(raw.demoReady),
      links: typeof raw.links === 'object' && raw.links ? (raw.links as Project['links']) : {},
      architecture: raw.architecture as Project['architecture'],
      screenshots: Array.isArray(raw.screenshots) ? (raw.screenshots as string[]) : [],
      highlights: Array.isArray(raw.highlights) ? (raw.highlights as Project['highlights']) : [],
      technicalHighlights: Array.isArray(raw.technicalHighlights) ? (raw.technicalHighlights as Project['highlights']) : [],
      challenges: Array.isArray(raw.challenges) ? (raw.challenges as Project['highlights']) : [],
      impact: Array.isArray(raw.impact) ? (raw.impact as Project['impact']) : [],
      nextSteps: Array.isArray(raw.nextSteps) ? (raw.nextSteps as Project['nextSteps']) : [],
      team: Array.isArray(raw.team) ? (raw.team as Project['team']) : [],
      tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
      speakerNotes: typeof raw.speakerNotes === 'string' ? raw.speakerNotes : '',
    });
  }

  return { projects };
}
