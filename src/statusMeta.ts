import type { Priority, Status } from './types';

export const STATUS_COLORS: Record<Status, string> = {
  Todo: '#9ca3af',
  'In Progress': '#3b82f6',
  Review: '#f59e0b',
  Blocked: '#ef4444',
  Done: '#22a866',
};

export const STATUS_ORDER: Status[] = ['Todo', 'In Progress', 'Review', 'Blocked', 'Done'];

export const PRIORITY_COLORS: Record<Priority, string> = {
  High: '#ef4444',
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

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
