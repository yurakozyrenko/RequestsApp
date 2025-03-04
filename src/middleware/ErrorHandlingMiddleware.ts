import { Request, Response, NextFunction } from 'express';
import ApiError from '../error/ApiError';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Непредвиденная ошибка' });
  }

  next(err);
};

export default errorHandler;
