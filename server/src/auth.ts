import crypto from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

const COOKIE_NAME = 'hackathon_auth';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    cookies[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return cookies;
}

// Cookie holds a hash of the password (never the password itself) so it can be
// verified without a session store.
function tokenFor(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function isAuthenticated(req: Request): boolean {
  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) return true; // no password configured — auth gate is a no-op
  const cookies = parseCookies(req.headers.cookie);
  return cookies[COOKIE_NAME] === tokenFor(appPassword);
}

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (isAuthenticated(req)) {
    next();
    return;
  }
  res.status(401).json({ error: 'Unauthorized' });
};

export const login: RequestHandler = (req, res) => {
  const appPassword = process.env.APP_PASSWORD;
  const { password } = req.body ?? {};
  if (!appPassword || password !== appPassword) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }
  res.cookie(COOKIE_NAME, tokenFor(appPassword), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_MS,
    path: '/',
  });
  res.json({ ok: true });
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
};

export const checkAuth: RequestHandler = (req, res) => {
  res.json({ authenticated: isAuthenticated(req) });
};
