export type HackathonStatus = 'upcoming' | 'active' | 'completed';

export function getEventBoundaries(date: string, startHour: number, endHour: number): { start: Date; end: Date } {
  const [y, m, d] = date.split('-').map(Number);
  const start = new Date(y, m - 1, d, startHour, 0, 0, 0);
  const end = new Date(y, m - 1, d, endHour, 0, 0, 0);
  return { start, end };
}

export function getHackathonStatus(
  date: string,
  startHour: number,
  endHour: number,
  now: Date = new Date(),
): HackathonStatus {
  const { start, end } = getEventBoundaries(date, startHour, endHour);
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
}

export function formatHour(hour: number): string {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export const STATUS_LABELS: Record<HackathonStatus, string> = {
  upcoming: 'Upcoming',
  active: 'Live',
  completed: 'Completed',
};

export const STATUS_CHIP_COLORS: Record<HackathonStatus, 'info' | 'success' | 'default'> = {
  upcoming: 'info',
  active: 'success',
  completed: 'default',
};
