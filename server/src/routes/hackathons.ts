import { Router } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../asyncHandler.js';
import Hackathon from '../models/Hackathon.js';
import Task from '../models/Task.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const hackathons = await Hackathon.find().sort({ date: -1 }).lean();

    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$hackathonId',
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] } },
        },
      },
    ]);
    const statsById = new Map(stats.map((s) => [String(s._id), { total: s.total, done: s.done }]));

    const summaries = hackathons.map((h) => ({
      _id: h._id,
      name: h.name,
      description: h.description,
      date: h.date,
      startHour: h.startHour,
      endHour: h.endHour,
      participantCount: h.participants.length,
      taskStats: statsById.get(String(h._id)) ?? { total: 0, done: 0 },
    }));

    res.json(summaries);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, description, date, startHour, endHour, participants, milestones, keyLearnings, summaryStats } =
      req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'name is required' });
      return;
    }
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'date is required' });
      return;
    }
    const hackathon = await Hackathon.create({
      name: name.trim(),
      description: description ?? '',
      date,
      startHour: startHour ?? 11,
      endHour: endHour ?? 23,
      participants: participants ?? [],
      milestones: milestones ?? [],
      keyLearnings: keyLearnings ?? [],
      summaryStats: summaryStats ?? {},
    });
    res.status(201).json(hackathon);
  }),
);

router.get(
  '/:id',
  asyncHandler<{ id: string }>(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(404).json({ error: 'Hackathon not found' });
      return;
    }
    const hackathon = await Hackathon.findById(req.params.id).lean();
    if (!hackathon) {
      res.status(404).json({ error: 'Hackathon not found' });
      return;
    }
    res.json(hackathon);
  }),
);

router.patch(
  '/:id',
  asyncHandler<{ id: string }>(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(404).json({ error: 'Hackathon not found' });
      return;
    }
    const { name, description, date, startHour, endHour, participants, milestones, keyLearnings, summaryStats } =
      req.body;
    const patch: Record<string, unknown> = {};
    if (name !== undefined) patch.name = name;
    if (description !== undefined) patch.description = description;
    if (date !== undefined) patch.date = date;
    if (startHour !== undefined) patch.startHour = startHour;
    if (endHour !== undefined) patch.endHour = endHour;
    if (participants !== undefined) patch.participants = participants;
    if (milestones !== undefined) patch.milestones = milestones;
    if (keyLearnings !== undefined) patch.keyLearnings = keyLearnings;
    if (summaryStats !== undefined) patch.summaryStats = summaryStats;

    const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, patch, { new: true }).lean();
    if (!hackathon) {
      res.status(404).json({ error: 'Hackathon not found' });
      return;
    }
    res.json(hackathon);
  }),
);

export default router;
