import type { Hackathon, HackathonSummary, Member, Milestone, ParkingItem, Project, SummaryStats, Task, Win } from './types';

// Same-origin `/api` works out of the box on Vercel (frontend + serverless API share a domain).
// Local dev defaults to the standalone server/ process unless overridden via VITE_API_URL.
const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api');

interface ApiTask extends Omit<Task, 'id'> {
  taskId: string;
}

interface ApiParkingItem {
  _id: string;
  text: string;
}

interface ApiHackathon {
  _id: string;
  name: string;
  description: string;
  date: string;
  startHour: number;
  endHour: number;
  participants: Array<{ name: string; role: string }>;
  milestones: Array<{ time: string; label: string }>;
  keyLearnings?: string[];
  summaryStats?: SummaryStats;
}

interface ApiProject extends Omit<Project, 'id'> {
  projectId: string;
  description?: string; // legacy field, replaced by oneLiner/problem/solution
}

interface ApiHackathonSummary {
  _id: string;
  name: string;
  description: string;
  date: string;
  startHour: number;
  endHour: number;
  participantCount: number;
  taskStats: { total: number; done: number };
}

function toTask(t: ApiTask): Task {
  const { taskId, ...rest } = t;
  return { id: taskId, ...rest };
}

function toProject(p: ApiProject): Project {
  const { projectId, description, ...rest } = p;
  return {
    id: projectId,
    ...rest,
    oneLiner: rest.oneLiner || description || '',
    problem: rest.problem ?? '',
    solution: rest.solution ?? '',
    screenshots: rest.screenshots ?? [],
    highlights: rest.highlights ?? [],
    technicalHighlights: rest.technicalHighlights ?? [],
    challenges: rest.challenges ?? [],
    impact: rest.impact ?? [],
    nextSteps: rest.nextSteps ?? [],
    team: rest.team ?? [],
    tags: rest.tags ?? [],
  };
}

function fromProject(p: Project): ApiProject {
  const { id, ...rest } = p;
  return { projectId: id, ...rest };
}

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

function toHackathon(h: ApiHackathon): Hackathon {
  const participants: Member[] = h.participants.map((p, i) => ({
    id: `${slugify(p.name) || 'member'}-${i}`,
    name: p.name,
    role: p.role,
  }));
  const milestones: Milestone[] = h.milestones.map((m, i) => ({
    id: `m${i}`,
    time: m.time,
    label: m.label,
  }));
  return {
    id: h._id,
    name: h.name,
    description: h.description,
    date: h.date,
    startHour: h.startHour,
    endHour: h.endHour,
    participants,
    milestones,
    keyLearnings: h.keyLearnings ?? [],
    summaryStats: h.summaryStats ?? {},
  };
}

function toHackathonSummary(h: ApiHackathonSummary): HackathonSummary {
  return {
    id: h._id,
    name: h.name,
    description: h.description,
    date: h.date,
    startHour: h.startHour,
    endHour: h.endHour,
    participantCount: h.participantCount,
    taskStats: h.taskStats,
  };
}

export async function apiCheckAuth(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/check`, { credentials: 'include' });
  if (!res.ok) return false;
  const data: { authenticated: boolean } = await res.json();
  return data.authenticated;
}

export async function apiLogin(password: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

export async function apiLogout(): Promise<void> {
  await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
}

export async function apiFetchHackathons(): Promise<HackathonSummary[]> {
  const res = await fetch(`${API_BASE}/hackathons`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch hackathons');
  const data: ApiHackathonSummary[] = await res.json();
  return data.map(toHackathonSummary);
}

export async function apiFetchHackathon(id: string): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/hackathons/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch hackathon');
  return toHackathon(await res.json());
}

export async function apiCreateHackathon(data: Omit<Hackathon, 'id'>): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/hackathons`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create hackathon');
  return toHackathon(await res.json());
}

export async function apiUpdateHackathon(id: string, patch: Partial<Omit<Hackathon, 'id'>>): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/hackathons/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update hackathon');
  return toHackathon(await res.json());
}

export async function apiFetchTasks(hackathonId: string): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/tasks`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data: ApiTask[] = await res.json();
  return data.map(toTask);
}

export async function apiCreateTask(
  hackathonId: string,
  data: { title: string; primaryOwner?: string; secondaryOwners?: string[]; priority?: Task['priority'] },
): Promise<Task> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/tasks`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return toTask(await res.json());
}

export async function apiPatchTask(hackathonId: string, id: string, patch: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/tasks/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return toTask(await res.json());
}

export async function apiFetchWins(hackathonId: string): Promise<Win[]> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/wins`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch wins');
  const data: Array<{ _id: string; text: string; time: number }> = await res.json();
  return data.map((w) => ({ id: w._id, text: w.text, time: w.time }));
}

export async function apiPostWin(hackathonId: string, text: string): Promise<Win> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/wins`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add win');
  const w = await res.json();
  return { id: w._id, text: w.text, time: w.time };
}

export async function apiFetchParkingLot(hackathonId: string): Promise<ParkingItem[]> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/parking-lot`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch parking lot');
  const data: ApiParkingItem[] = await res.json();
  return data.map((p) => ({ id: p._id, text: p.text }));
}

export async function apiPostParkingItem(hackathonId: string, text: string): Promise<ParkingItem> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/parking-lot`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add parking lot item');
  const p = await res.json();
  return { id: p._id, text: p.text };
}

export async function apiDeleteParkingItem(hackathonId: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/parking-lot/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete parking lot item');
}

export async function apiFetchProjects(hackathonId: string): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/projects`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data: ApiProject[] = await res.json();
  return data.map(toProject);
}

export async function apiSaveProjects(hackathonId: string, projects: Project[]): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/projects`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projects.map(fromProject)),
  });
  if (!res.ok) throw new Error('Failed to save projects');
  const data: ApiProject[] = await res.json();
  return data.map(toProject);
}
