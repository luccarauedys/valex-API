import { Router } from 'express';
import 'express-async-errors';
import cardRouter from './cardRouter.js';
import errorHandler from '../middlewares/errorHandlerMiddleware.js';

const router = Router();
router.use(cardRouter);
router.use(errorHandler);

export default router;
