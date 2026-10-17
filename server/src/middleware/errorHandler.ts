import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[ListingLab Error]:', err?.message || err);

  const statusCode = err.statusCode || (err.message?.includes('timed out') ? 504 : 500);

  res.status(statusCode).json({
    success: false,
    error: err.name || 'ServerError',
    message: err.message || 'An unexpected error occurred while processing your listing.',
  });
};
