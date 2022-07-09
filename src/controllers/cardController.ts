import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';

type TransactionTypes = 'groceries' | 'restaurant' | 'transport' | 'education' | 'health';

export async function createCard(req: Request, res: Response) {
  const { employeeId, cardType }: { employeeId: string; cardType: TransactionTypes } = req.body;
  const { apikey } = req.headers;
  await cardService.createCard(cardType, Number(employeeId), apikey);
  res.sendStatus(201);
}
