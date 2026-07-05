import mongoose, { Schema, type Model } from 'mongoose';

export type ProjectStatus = 'Planning' | 'In Progress' | 'Demo Ready' | 'Done';

export interface IProjectLinks {
  liveDemo?: string;
  figma?: string;
  hosted?: string;
  github?: string;
  dashboard?: string;
  documentation?: string;
}

export interface IProjectArchitecture {
  type: 'image' | 'markdown' | 'mermaid' | 'iframe';
  content: string;
}

export interface IProjectHighlight {
  title: string;
  description?: string;
}

export interface IProjectImpact {
  label: string;
  value: string;
  description?: string;
}

export interface IProjectTeamMember {
  name: string;
  role: string;
  contribution?: string;
}

export type ProjectNextStepCategory = 'future' | 'upcoming' | 'limitation' | 'tech-debt';

export interface IProjectNextStep {
  title: string;
  category?: ProjectNextStepCategory;
}

export interface IProject {
  hackathonId: mongoose.Types.ObjectId;
  projectId: string;
  name: string;
  oneLiner: string;
  problem: string;
  solution: string;
  duration?: string;
  owner: string;
  status: ProjectStatus;
  progress: number;
  demoReady: boolean;
  links: IProjectLinks;
  architecture?: IProjectArchitecture;
  screenshots: string[];
  highlights: IProjectHighlight[];
  technicalHighlights: IProjectHighlight[];
  challenges: IProjectHighlight[];
  impact: IProjectImpact[];
  nextSteps: IProjectNextStep[];
  team: IProjectTeamMember[];
  tags: string[];
  speakerNotes?: string;
  order: number;
}

const LinksSchema = new Schema<IProjectLinks>(
  {
    liveDemo: { type: String, default: '' },
    figma: { type: String, default: '' },
    hosted: { type: String, default: '' },
    github: { type: String, default: '' },
    dashboard: { type: String, default: '' },
    documentation: { type: String, default: '' },
  },
  { _id: false },
);

const ArchitectureSchema = new Schema<IProjectArchitecture>(
  {
    type: { type: String, enum: ['image', 'markdown', 'mermaid', 'iframe'], required: true },
    content: { type: String, default: '' },
  },
  { _id: false },
);

const HighlightSchema = new Schema<IProjectHighlight>(
  { title: { type: String, required: true, trim: true }, description: { type: String, default: '' } },
  { _id: false },
);

const ImpactSchema = new Schema<IProjectImpact>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
  },
  { _id: false },
);

const TeamMemberSchema = new Schema<IProjectTeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '', trim: true },
    contribution: { type: String, default: '' },
  },
  { _id: false },
);

const NextStepSchema = new Schema<IProjectNextStep>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ['future', 'upcoming', 'limitation', 'tech-debt'], default: 'future' },
  },
  { _id: false },
);

const ProjectSchema = new Schema<IProject>(
  {
    hackathonId: { type: Schema.Types.ObjectId, required: true, index: true },
    projectId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    oneLiner: { type: String, default: '', trim: true },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    duration: { type: String, default: '' },
    owner: { type: String, default: '' },
    status: { type: String, enum: ['Planning', 'In Progress', 'Demo Ready', 'Done'], default: 'Planning' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    demoReady: { type: Boolean, default: false },
    links: { type: LinksSchema, default: () => ({}) },
    architecture: { type: ArchitectureSchema, default: undefined },
    screenshots: { type: [String], default: [] },
    highlights: { type: [HighlightSchema], default: [] },
    technicalHighlights: { type: [HighlightSchema], default: [] },
    challenges: { type: [HighlightSchema], default: [] },
    impact: { type: [ImpactSchema], default: [] },
    nextSteps: { type: [NextStepSchema], default: [] },
    team: { type: [TeamMemberSchema], default: [] },
    tags: { type: [String], default: [] },
    speakerNotes: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProjectSchema.index({ hackathonId: 1, projectId: 1 }, { unique: true });

const Project: Model<IProject> =
  mongoose.models.HackathonProject ?? mongoose.model<IProject>('HackathonProject', ProjectSchema, 'hackathon_projects');

export default Project;
