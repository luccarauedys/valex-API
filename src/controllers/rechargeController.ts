import { Request, Response } from 'express';

import * as rechargeService from '../services/rechargeService.js';

export async function rechargeCard(req: Request, res: Response) {
  const { cardId, amount }: { cardId: string; amount: string } = req.body;
  const { apikey } = req.headers;
  await rechargeService.rechargeCard(Number(cardId), Number(amount), apikey);
  res.sendStatus(200);
}
