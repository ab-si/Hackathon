import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB } from './db.js';
import Task from './models/Task.js';
import ParkingLotItem from './models/ParkingLotItem.js';
import { SEED_PARKING_LOT, SEED_TASKS } from './seedData.js';
import tasksRouter from './routes/tasks.js';
import winsRouter from './routes/wins.js';
import parkingLotRouter from './routes/parkingLot.js';

const PORT = process.env.PORT ?? 4000;

async function seedIfEmpty() {
  if ((await Task.countDocuments()) === 0) {
    await Task.insertMany(SEED_TASKS);
  }
  if ((await ParkingLotItem.countDocuments()) === 0) {
    await ParkingLotItem.insertMany(SEED_PARKING_LOT.map((text) => ({ text })));
  }
}

async function main() {
  await connectDB();
  await seedIfEmpty();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/tasks', tasksRouter);
  app.use('/api/wins', winsRouter);
  app.use('/api/parking-lot', parkingLotRouter);

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.listen(PORT, () => {
    console.log(`Hackathon dashboard API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
