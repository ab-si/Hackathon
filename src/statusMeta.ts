import type { Priority, Status, Task } from './types';

export const STATUS_COLORS: Record<Status, string> = {
  Todo: '#9ca3af',
  'In Progress': '#6366f1',
  Review: '#f59e0b',
  Blocked: '#f43f5e',
  Done: '#10b981',
};

export const STATUS_ORDER: Status[] = ['Todo', 'In Progress', 'Review', 'Blocked', 'Done'];

export const PRIORITY_COLORS: Record<Priority, string> = {
  High: '#f43f5e',
  Medium: '#f59e0b',
  Low: '#6b7280',
};

export function timeAgo(ts: number, now: number = Date.now()) {
  const diff = Math.max(0, now - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ${min % 60}m ago`;
  return new Date(ts).toLocaleDateString();
}

export function isTaskOwner(task: Task, memberName: string): boolean {
  const name = memberName.toLowerCase();
  return (
    task.primaryOwner.toLowerCase().startsWith(name) || task.secondaryOwners.some((o) => o.toLowerCase().startsWith(name))
  );
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
