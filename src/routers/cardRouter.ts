import { Router } from 'express';

import { createCard } from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post('/card', createCard);

export default cardRouter;
