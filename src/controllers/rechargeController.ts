import { Request, Response } from 'express';

import * as rechargeService from '../services/rechargeService.js';

export async function rechargeCard(req: Request, res: Response) {
  const { cardId, amount }: { cardId: string; amount: string } = req.body;
  const { apikey } = req.headers;

  if (!Number(amount) || Number(amount) <= 0) return res.status(422).send("recharge's amount must be a number and also a value greater than 0");

  await rechargeService.rechargeCard(Number(cardId), Number(amount), apikey);
  res.sendStatus(200);
}
