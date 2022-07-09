import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

export default function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  console.log(error);

  if (error.message && error.status) {
    return res.status(error.status).send(error.message);
  }

  res.sendStatus(500);
}
