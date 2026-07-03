import mongoose, { Schema, type Model } from 'mongoose';

export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Todo' | 'In Progress' | 'Review' | 'Blocked' | 'Done';

export interface ITask {
  taskId: string;
  title: string;
  owners: string[];
  priority: Priority;
  status: Status;
  progress: number;
  notes: string;
  updatedAt: number;
}

const TaskSchema = new Schema<ITask>(
  {
    taskId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    owners: { type: [String], default: [] },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Review', 'Blocked', 'Done'],
      default: 'Todo',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    notes: { type: String, default: '' },
    updatedAt: { type: Number, default: () => Date.now() },
  },
  { timestamps: true },
);

const Task: Model<ITask> = mongoose.models.Task ?? mongoose.model<ITask>('Task', TaskSchema);

export default Task;
