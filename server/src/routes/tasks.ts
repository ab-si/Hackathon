import { Router } from 'express';
import Task from '../models/Task.js';

interface HackathonParams {
  hackathonId: string;
}

const router = Router({ mergeParams: true });

router.get<HackathonParams>('/', async (req, res) => {
  const { hackathonId } = req.params;
  const tasks = await Task.find({ hackathonId }).sort({ taskId: 1 }).lean();
  res.json(tasks);
});

router.post<HackathonParams>('/', async (req, res) => {
  const { hackathonId } = req.params;
  const { title, primaryOwner, secondaryOwners, priority } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const taskId = `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const task = await Task.create({
    hackathonId,
    taskId,
    title: title.trim(),
    primaryOwner: typeof primaryOwner === 'string' ? primaryOwner : '',
    secondaryOwners: Array.isArray(secondaryOwners) ? secondaryOwners : [],
    priority: priority ?? 'Medium',
    status: 'Todo',
    progress: 0,
    notes: '',
    updatedAt: Date.now(),
  });
  res.status(201).json(task);
});

router.patch<HackathonParams & { taskId: string }>('/:taskId', async (req, res) => {
  const { hackathonId, taskId } = req.params;
  const patch = { ...req.body, updatedAt: Date.now() };
  const task = await Task.findOneAndUpdate({ taskId, hackathonId }, patch, { new: true }).lean();
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
});

export default router;
