import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async route handler so a rejected promise (e.g. a Mongoose
 * ValidationError) is forwarded to Express's error middleware instead of
 * becoming an unhandled rejection that crashes the whole process.
 */
export function asyncHandler<P = Record<string, string>>(
  handler: (req: Request<P>, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler<P> {
  return (req, res, next) => {
    handler(req as Request<P>, res, next).catch(next);
  };
}
