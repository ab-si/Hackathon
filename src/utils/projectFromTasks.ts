import type { Project, ProjectStatus, Status, Task } from '../types';

const STATUS_MAP: Record<Status, ProjectStatus> = {
  Todo: 'Planning',
  'In Progress': 'In Progress',
  Review: 'Demo Ready',
  Blocked: 'In Progress',
  Done: 'Done',
};

function projectFromTask(task: Task): Project {
  const team = [task.primaryOwner, ...task.secondaryOwners]
    .filter((name): name is string => Boolean(name))
    .map((name) => ({ name, role: '' }));

  const tags = [task.priority.toLowerCase()];
  if (task.status === 'Blocked') tags.push('blocked');

  return {
    id: task.id,
    name: task.title,
    oneLiner: task.notes || '',
    problem: '',
    solution: '',
    owner: task.primaryOwner,
    status: STATUS_MAP[task.status],
    progress: task.progress,
    demoReady: task.status === 'Review' || task.status === 'Done',
    links: {},
    screenshots: [],
    highlights: [],
    technicalHighlights: [],
    challenges: [],
    impact: [],
    nextSteps: [],
    team,
    tags,
    speakerNotes: '',
  };
}

export function generateProjectsFromTasks(tasks: Task[]): Project[] {
  return tasks.map(projectFromTask);
}

/**
 * Regenerates project entries from tasks while preserving any manually-added
 * enrichment (links, highlights, screenshots, impact, next steps, speaker notes)
 * on projects that were already generated from the same task.
 */
export function mergeProjectsFromTasks(existing: Project[], tasks: Task[]): Project[] {
  const existingById = new Map(existing.map((p) => [p.id, p]));

  return tasks.map((task) => {
    const prior = existingById.get(task.id);
    if (!prior) return projectFromTask(task);

    return {
      ...prior,
      name: task.title,
      oneLiner: prior.oneLiner || task.notes || '',
      owner: task.primaryOwner,
      status: STATUS_MAP[task.status],
      progress: task.progress,
      demoReady: task.status === 'Review' || task.status === 'Done',
    };
  });
}
