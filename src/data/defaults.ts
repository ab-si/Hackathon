import type { Member, Milestone } from '../types';

export const DEFAULT_TEAM: Member[] = [
  { id: 'abhishek', name: 'Abhishek', role: 'Technical Lead' },
  { id: 'sanjeev', name: 'Sanjeev', role: 'UI/UX Lead' },
  { id: 'tejas', name: 'Tejas', role: 'Frontend Developer' },
  { id: 'yogita', name: 'Yogita', role: 'Ecology Domain Expert' },
];

export const DEFAULT_MILESTONES: Milestone[] = [
  { id: 'm1', time: '11:00', label: 'Kickoff' },
  { id: 'm2', time: '12:30', label: 'Checkpoint 1' },
  { id: 'm3', time: '14:00', label: 'Lunch' },
  { id: 'm4', time: '16:30', label: 'Cafe Hop' },
  { id: 'm5', time: '17:00', label: 'Checkpoint 2' },
  { id: 'm6', time: '20:00', label: 'Dinner' },
  { id: 'm7', time: '22:00', label: 'Polish & Testing' },
  { id: 'm8', time: '23:00', label: 'Demo' },
];

export const DEFAULT_START_HOUR = 11;
export const DEFAULT_END_HOUR = 23;
