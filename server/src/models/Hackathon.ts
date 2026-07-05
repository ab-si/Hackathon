import mongoose, { Schema, type Model } from 'mongoose';

export interface IParticipant {
  name: string;
  role: string;
}

export interface IMilestone {
  time: string; // "HH:mm" 24h
  label: string;
}

export interface ISummaryStats {
  commits?: number;
  prs?: number;
}

export interface IHackathon {
  name: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  startHour: number; // 0-23
  endHour: number; // 0-23
  participants: IParticipant[];
  milestones: IMilestone[];
  keyLearnings: string[];
  summaryStats: ISummaryStats;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '', trim: true },
  },
  { _id: false },
);

const MilestoneSchema = new Schema<IMilestone>(
  {
    time: { type: String, required: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const SummaryStatsSchema = new Schema<ISummaryStats>(
  {
    commits: { type: Number },
    prs: { type: Number },
  },
  { _id: false },
);

const HackathonSchema = new Schema<IHackathon>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    date: { type: String, required: true },
    startHour: { type: Number, required: true, min: 0, max: 23 },
    endHour: { type: Number, required: true, min: 0, max: 23 },
    participants: { type: [ParticipantSchema], default: [] },
    milestones: { type: [MilestoneSchema], default: [] },
    keyLearnings: { type: [String], default: [] },
    summaryStats: { type: SummaryStatsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

const Hackathon: Model<IHackathon> =
  mongoose.models.Hackathon ?? mongoose.model<IHackathon>('Hackathon', HackathonSchema, 'hackathon_hackathons');

export default Hackathon;
