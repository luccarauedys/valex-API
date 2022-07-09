import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';

type TransactionTypes = 'groceries' | 'restaurant' | 'transport' | 'education' | 'health';

export async function createCard(req: Request, res: Response) {
  const { employeeId, cardType }: { employeeId: string; cardType: TransactionTypes } = req.body;
  const { apikey } = req.headers;

  const createdCard = await cardService.createCard(cardType, Number(employeeId), apikey);
  res.status(201).send(createdCard);
}

export async function activateCard(req: Request, res: Response) {
  const { cardId, cardCVC, newPassword }: { cardId: string; cardCVC: string; newPassword: string } = req.body;

  if (newPassword.length !== 4 || !Number(newPassword)) {
    return res.status(400).send('password must consist of only 4 numbers.');
  }

  await cardService.activateCard(cardId, cardCVC, newPassword);
  res.sendStatus(201);
}

export async function getCardFinancialInfos(req: Request, res: Response) {
  const { cardId }: { cardId: string } = req.body;
  const cardFinancialInfos = await cardService.getCardFinancialInfos(Number(cardId));
  res.status(200).send(cardFinancialInfos);
}

export async function lockCard(req: Request, res: Response) {}

export async function unlockCard(req: Request, res: Response) {}
