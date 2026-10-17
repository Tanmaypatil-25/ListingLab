import { Request, Response, NextFunction } from 'express';
import { ListingInputSchema } from '../types.js';

export const validateListingRequest = (req: Request, res: Response, next: NextFunction): void => {
  const result = ListingInputSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Please check your input details and fix the errors.',
      details: errors,
    });
    return;
  }

  req.body = result.data;
  next();
};
