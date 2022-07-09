import { Router } from 'express';

import { payment } from '../controllers/paymentController.js';

const paymentRouter = Router();

paymentRouter.post('/payment', payment);

export default paymentRouter;
