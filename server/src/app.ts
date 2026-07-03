import cors from 'cors';
import express from 'express';
import { connectDB } from './db.js';
import Task from './models/Task.js';
import ParkingLotItem from './models/ParkingLotItem.js';
import { SEED_PARKING_LOT, SEED_TASKS } from './seedData.js';
import tasksRouter from './routes/tasks.js';
import winsRouter from './routes/wins.js';
import parkingLotRouter from './routes/parkingLot.js';

async function seedIfEmpty() {
  if ((await Task.countDocuments()) === 0) {
    await Task.insertMany(SEED_TASKS);
  }
  if ((await ParkingLotItem.countDocuments()) === 0) {
    await ParkingLotItem.insertMany(SEED_PARKING_LOT.map((text) => ({ text })));
  }
}

let readyPromise: Promise<void> | null = null;

// Connects + seeds at most once per warm process (local server or serverless instance).
export function ready(): Promise<void> {
  if (!readyPromise) {
    readyPromise = connectDB().then(() => seedIfEmpty());
  }
  return readyPromise;
}

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    await ready();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/tasks', tasksRouter);
app.use('/api/wins', winsRouter);
app.use('/api/parking-lot', parkingLotRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
