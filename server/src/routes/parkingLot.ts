import { Router } from 'express';
import ParkingLotItem from '../models/ParkingLotItem.js';

interface HackathonParams {
  hackathonId: string;
}

const router = Router({ mergeParams: true });

router.get<HackathonParams>('/', async (req, res) => {
  const { hackathonId } = req.params;
  const items = await ParkingLotItem.find({ hackathonId }).sort({ createdAt: 1 }).lean();
  res.json(items);
});

router.post<HackathonParams>('/', async (req, res) => {
  const { hackathonId } = req.params;
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'text is required' });
    return;
  }
  const item = await ParkingLotItem.create({ hackathonId, text: text.trim() });
  res.status(201).json(item);
});

router.delete<HackathonParams & { id: string }>('/:id', async (req, res) => {
  const { hackathonId, id } = req.params;
  await ParkingLotItem.findOneAndDelete({ _id: id, hackathonId });
  res.status(204).end();
});

export default router;
