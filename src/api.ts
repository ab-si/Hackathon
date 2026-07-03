import type { Hackathon, HackathonSummary, Member, Milestone, ParkingItem, Task, Win } from './types';

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

export async function apiFetchHackathons(): Promise<HackathonSummary[]> {
  const res = await fetch(`${API_BASE}/hackathons`);
  if (!res.ok) throw new Error('Failed to fetch hackathons');
  const data: ApiHackathonSummary[] = await res.json();
  return data.map(toHackathonSummary);
}

export async function apiFetchHackathon(id: string): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/hackathons/${id}`);
  if (!res.ok) throw new Error('Failed to fetch hackathon');
  return toHackathon(await res.json());
}

export async function apiCreateHackathon(data: Omit<Hackathon, 'id'>): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/hackathons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create hackathon');
  return toHackathon(await res.json());
}

export async function apiUpdateHackathon(id: string, patch: Partial<Omit<Hackathon, 'id'>>): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/hackathons/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update hackathon');
  return toHackathon(await res.json());
}

export async function apiFetchTasks(hackathonId: string): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/tasks`);
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return toTask(await res.json());
}

export async function apiPatchTask(hackathonId: string, id: string, patch: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return toTask(await res.json());
}

export async function apiFetchWins(hackathonId: string): Promise<Win[]> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/wins`);
  if (!res.ok) throw new Error('Failed to fetch wins');
  const data: Array<{ _id: string; text: string; time: number }> = await res.json();
  return data.map((w) => ({ id: w._id, text: w.text, time: w.time }));
}

export async function apiPostWin(hackathonId: string, text: string): Promise<Win> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/wins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add win');
  const w = await res.json();
  return { id: w._id, text: w.text, time: w.time };
}

export async function apiFetchParkingLot(hackathonId: string): Promise<ParkingItem[]> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/parking-lot`);
  if (!res.ok) throw new Error('Failed to fetch parking lot');
  const data: ApiParkingItem[] = await res.json();
  return data.map((p) => ({ id: p._id, text: p.text }));
}

export async function apiPostParkingItem(hackathonId: string, text: string): Promise<ParkingItem> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/parking-lot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add parking lot item');
  const p = await res.json();
  return { id: p._id, text: p.text };
}

export async function apiDeleteParkingItem(hackathonId: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/parking-lot/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete parking lot item');
}
