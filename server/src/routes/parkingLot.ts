import { Router } from 'express';
import ParkingLotItem from '../models/ParkingLotItem.js';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await ParkingLotItem.find().sort({ createdAt: 1 }).lean();
  res.json(items);
});

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'text is required' });
    return;
  }
  const item = await ParkingLotItem.create({ text: text.trim() });
  res.status(201).json(item);
});

router.delete('/:id', async (req, res) => {
  await ParkingLotItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
