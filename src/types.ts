export type Status = 'Todo' | 'In Progress' | 'Review' | 'Blocked' | 'Done';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Member {
  id: string;
  name: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  primaryOwner: string; // '' = unassigned
  secondaryOwners: string[];
  priority: Priority;
  status: Status;
  progress: number;
  notes: string;
  updatedAt: number;
}

export interface Milestone {
  id: string;
  time: string; // "HH:mm" 24h
  label: string;
}

export interface Win {
  id: string;
  text: string;
  time: number; // epoch ms
}

export interface ParkingItem {
  id: string;
  text: string;
}

export interface AppState {
  tasks: Task[];
  wins: Win[];
  parkingLot: string[];
  darkMode: boolean;
}

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  startHour: number;
  endHour: number;
  participants: Member[];
  milestones: Milestone[];
}

export interface HackathonSummary {
  id: string;
  name: string;
  description: string;
  date: string;
  startHour: number;
  endHour: number;
  participantCount: number;
  taskStats: { total: number; done: number };
}
