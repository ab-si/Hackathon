import { Router } from 'express';
import Win from '../models/Win.js';

interface HackathonParams {
  hackathonId: string;
}

const router = Router({ mergeParams: true });

router.get<HackathonParams>('/', async (req, res) => {
  const { hackathonId } = req.params;
  const wins = await Win.find({ hackathonId }).sort({ time: -1 }).lean();
  res.json(wins);
});

router.post<HackathonParams>('/', async (req, res) => {
  const { hackathonId } = req.params;
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'text is required' });
    return;
  }
  const win = await Win.create({ hackathonId, text: text.trim(), time: Date.now() });
  res.status(201).json(win);
});

export default router;
