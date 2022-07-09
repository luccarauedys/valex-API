import { Request, Response } from 'express';

import * as paymentService from '../services/paymentService.js';

export async function payment(req: Request, res: Response) {
  const { cardId, cardPassword, businessId, amount }: { cardId: string; cardPassword: string; businessId: string; amount: string } = req.body;

  if (!cardId || !cardPassword || !businessId || !amount)
    return res.status(400).send('information is missing. please, enter the ID and password of the card, the ID of the establishment and the value of the purchase');

  if (!Number(amount) || Number(amount) <= 0) return res.status(400).send('amount must be a number and also a value greater than 0');

  await paymentService.payment(Number(cardId), cardPassword, Number(businessId), Number(amount));
  res.sendStatus(200);
}
