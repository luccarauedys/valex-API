import { Router } from 'express';
import 'express-async-errors';
import cardRouter from './cardRouter.js';
import rechargeRouter from './rechargeRouter.js';
import errorHandler from '../middlewares/errorHandlerMiddleware.js';

const router = Router();
router.use(cardRouter);
router.use(rechargeRouter);
router.use(errorHandler);

export default router;
