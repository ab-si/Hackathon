import type { Task, Win } from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

interface ApiTask extends Omit<Task, 'id'> {
  taskId: string;
}

interface ApiParkingItem {
  _id: string;
  text: string;
}

function toTask(t: ApiTask): Task {
  const { taskId, ...rest } = t;
  return { id: taskId, ...rest };
}

export async function apiFetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data: ApiTask[] = await res.json();
  return data.map(toTask);
}

export async function apiPatchTask(id: string, patch: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return toTask(await res.json());
}

export async function apiFetchWins(): Promise<Win[]> {
  const res = await fetch(`${API_BASE}/wins`);
  if (!res.ok) throw new Error('Failed to fetch wins');
  const data: Array<{ _id: string; text: string; time: number }> = await res.json();
  return data.map((w) => ({ id: w._id, text: w.text, time: w.time }));
}

export async function apiPostWin(text: string): Promise<Win> {
  const res = await fetch(`${API_BASE}/wins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add win');
  const w = await res.json();
  return { id: w._id, text: w.text, time: w.time };
}

export async function apiFetchParkingLot(): Promise<{ id: string; text: string }[]> {
  const res = await fetch(`${API_BASE}/parking-lot`);
  if (!res.ok) throw new Error('Failed to fetch parking lot');
  const data: ApiParkingItem[] = await res.json();
  return data.map((p) => ({ id: p._id, text: p.text }));
}

export async function apiPostParkingItem(text: string): Promise<{ id: string; text: string }> {
  const res = await fetch(`${API_BASE}/parking-lot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add parking lot item');
  const p = await res.json();
  return { id: p._id, text: p.text };
}

export async function apiDeleteParkingItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/parking-lot/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete parking lot item');
}
