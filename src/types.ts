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

export interface SummaryStats {
  commits?: number;
  prs?: number;
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
  keyLearnings: string[];
  summaryStats: SummaryStats;
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

export type ProjectStatus = 'Planning' | 'In Progress' | 'Demo Ready' | 'Done';

export interface ProjectLinks {
  liveDemo?: string;
  figma?: string;
  hosted?: string;
  github?: string;
  dashboard?: string;
  documentation?: string;
}

export interface ProjectArchitecture {
  type: 'image' | 'markdown' | 'mermaid' | 'iframe';
  content: string;
}

export interface ProjectHighlight {
  title: string;
  description?: string;
}

export interface ProjectImpact {
  label: string;
  value: string;
  description?: string;
}

export interface ProjectTeamMember {
  name: string;
  role: string;
  contribution?: string;
}

export type ProjectNextStepCategory = 'future' | 'upcoming' | 'limitation' | 'tech-debt';

export interface ProjectNextStep {
  title: string;
  category?: ProjectNextStepCategory;
}

export interface Project {
  id: string;
  name: string;
  oneLiner: string;
  problem: string;
  solution: string;
  duration?: string;
  owner: string;
  status: ProjectStatus;
  progress: number;
  demoReady: boolean;
  links: ProjectLinks;
  architecture?: ProjectArchitecture;
  screenshots: string[];
  highlights: ProjectHighlight[];
  technicalHighlights: ProjectHighlight[];
  challenges: ProjectHighlight[];
  impact: ProjectImpact[];
  nextSteps: ProjectNextStep[];
  team: ProjectTeamMember[];
  tags: string[];
  speakerNotes?: string;
}
