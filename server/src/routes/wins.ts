import { Router } from 'express';
import Win from '../models/Win.js';

const router = Router();

router.get('/', async (_req, res) => {
  const wins = await Win.find().sort({ time: -1 }).lean();
  res.json(wins);
});

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'text is required' });
    return;
  }
  const win = await Win.create({ text: text.trim(), time: Date.now() });
  res.status(201).json(win);
});

export default router;
