import { Router } from 'express';

import { activateCard, createCard, getCardFinancialInfos, lockCard, unlockCard } from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post('/card', createCard);
cardRouter.post('/card/activation', activateCard);
cardRouter.get('/card/financial-infos', getCardFinancialInfos);
cardRouter.put('/card/lock', lockCard);
cardRouter.put('/card/unlock', unlockCard);

export default cardRouter;
