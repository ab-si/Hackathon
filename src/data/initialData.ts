import type { Member, Task, Milestone } from '../types';

export const MEMBERS: Member[] = [
  { id: 'abhishek', name: 'Abhishek', role: 'Technical Lead' },
  { id: 'sanjeev', name: 'Sanjeev', role: 'UI/UX Lead' },
  { id: 'tejas', name: 'Tejas', role: 'Frontend Developer' },
  { id: 'yogita', name: 'Yogita', role: 'Ecology Domain Expert' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Search Implementation',
    owners: ['Abhishek'],
    priority: 'High',
    status: 'Todo',
    progress: 0,
    notes: '',
    updatedAt: Date.now(),
  },
  {
    id: 't2',
    title: 'Planned Visit',
    owners: ['Abhishek'],
    priority: 'High',
    status: 'Todo',
    progress: 0,
    notes: '',
    updatedAt: Date.now(),
  },
  {
    id: 't3',
    title: 'Dashboard Landing Page Revamp',
    owners: ['Sanjeev (Design)', 'Abhishek (Implementation)'],
    priority: 'High',
    status: 'Todo',
    progress: 0,
    notes: '',
    updatedAt: Date.now(),
  },
  {
    id: 't4',
    title: 'Location Revamp',
    owners: ['Sanjeev (UI/UX)', 'Abhishek (Implementation)'],
    priority: 'Medium',
    status: 'Todo',
    progress: 0,
    notes: '',
    updatedAt: Date.now(),
  },
  {
    id: 't5',
    title: 'Developer Website Landing Page',
    owners: ['Sanjeev', 'Tejas (Implementation)', 'Abhishek (Review)'],
    priority: 'Medium',
    status: 'Todo',
    progress: 0,
    notes: '',
    updatedAt: Date.now(),
  },
  {
    id: 't6',
    title: 'Personal Dashboard',
    owners: ['Sanjeev', 'Tejas (Support)', 'TBD (Implementation)'],
    priority: 'Medium',
    status: 'Todo',
    progress: 0,
    notes: '',
    updatedAt: Date.now(),
  },
  {
    id: 't7',
    title: 'Ecology Dashboard',
    owners: ['Yogita'],
    priority: 'Medium',
    status: 'Todo',
    progress: 0,
    notes: 'Requirements, KPIs, Analytics, Brainstorming',
    updatedAt: Date.now(),
  },
  {
    id: 't8',
    title: 'Flutter App UX',
    owners: ['Sanjeev', 'Abhishek (If Time Permits)'],
    priority: 'Low',
    status: 'Todo',
    progress: 0,
    notes: '',
    updatedAt: Date.now(),
  },
];

export const MILESTONES: Milestone[] = [
  { id: 'm1', time: '11:00', label: 'Kickoff' },
  { id: 'm2', time: '12:30', label: 'Checkpoint 1' },
  { id: 'm3', time: '14:00', label: 'Lunch' },
  { id: 'm4', time: '16:30', label: 'Cafe Hop' },
  { id: 'm5', time: '17:00', label: 'Checkpoint 2' },
  { id: 'm6', time: '20:00', label: 'Dinner' },
  { id: 'm7', time: '22:00', label: 'Polish & Testing' },
  { id: 'm8', time: '23:00', label: 'Demo' },
];

export const EVENT_START_HOUR = 11; // 11:00 AM
export const EVENT_END_HOUR = 23; // 11:00 PM

export const INITIAL_WINS: string[] = [];
export const INITIAL_PARKING_LOT: string[] = [
  'Better search filters',
  'Dashboard animations',
  'Future analytics',
  'API optimization',
];
