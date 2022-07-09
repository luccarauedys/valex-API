import * as rechargeRepository from '../repositories/rechargeRepository.js';
import { checkApiKey, checkIfCardExists, checkCardExpiration } from './cardService.js';

export async function rechargeCard(cardId: number, amount: number, apikey: any) {
  if (!amount || amount <= 0) throw { message: "recharge's amount must be a number and also a value greater than 0", status: 422 };

  await checkApiKey(apikey);

  const card = await checkIfCardExists(cardId);
  if (!card.password) throw { message: 'you need to activate your card before recharging', status: 422 };

  await checkCardExpiration(card);

  await rechargeRepository.insert({ cardId, amount });
}
