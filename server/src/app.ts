import cors from 'cors';
import express from 'express';
import { connectDB } from './db.js';
import hackathonsRouter from './routes/hackathons.js';
import tasksRouter from './routes/tasks.js';
import winsRouter from './routes/wins.js';
import parkingLotRouter from './routes/parkingLot.js';

let readyPromise: Promise<void> | null = null;

// Connects at most once per warm process (local server or serverless instance).
export function ready(): Promise<void> {
  if (!readyPromise) {
    readyPromise = connectDB().then(() => undefined);
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

app.use('/api/hackathons', hackathonsRouter);
app.use('/api/hackathons/:hackathonId/tasks', tasksRouter);
app.use('/api/hackathons/:hackathonId/wins', winsRouter);
app.use('/api/hackathons/:hackathonId/parking-lot', parkingLotRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
