import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import hackathonsRouter from './routes/hackathons.js';
import tasksRouter from './routes/tasks.js';
import winsRouter from './routes/wins.js';
import parkingLotRouter from './routes/parkingLot.js';
import projectsRouter from './routes/projects.js';
import { checkAuth, login, logout, requireAuth } from './auth.js';

let readyPromise: Promise<void> | null = null;

// Connects at most once per warm process (local server or serverless instance).
export function ready(): Promise<void> {
  if (!readyPromise) {
    readyPromise = connectDB().then(() => undefined);
  }
  return readyPromise;
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    await ready();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/auth/check', checkAuth);
app.post('/api/login', login);
app.post('/api/logout', logout);

app.use('/api/hackathons', requireAuth, hackathonsRouter);
app.use('/api/hackathons/:hackathonId/tasks', requireAuth, tasksRouter);
app.use('/api/hackathons/:hackathonId/wins', requireAuth, winsRouter);
app.use('/api/hackathons/:hackathonId/parking-lot', requireAuth, parkingLotRouter);
app.use('/api/hackathons/:hackathonId/projects', requireAuth, projectsRouter);

// Last-resort safety net: any error forwarded via next(err) (see asyncHandler)
// lands here instead of crashing the process. Must be registered after all routes.
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Internal server error' });
};
app.use(errorHandler);

export default app;
