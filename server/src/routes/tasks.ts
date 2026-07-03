import { Router } from 'express';
import Task from '../models/Task.js';

const router = Router();

router.get('/', async (_req, res) => {
  const tasks = await Task.find().sort({ taskId: 1 }).lean();
  res.json(tasks);
});

router.patch('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const patch = { ...req.body, updatedAt: Date.now() };
  const task = await Task.findOneAndUpdate({ taskId }, patch, { new: true }).lean();
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
});

export default router;
