import * as rechargeRepository from '../repositories/rechargeRepository.js';
import { checkApiKey, checkIfCardExists, checkCardExpiration } from './cardService.js';

export async function rechargeCard(cardId: number, amount: number, apikey: any) {
  await checkApiKey(apikey);

  const card = await checkIfCardExists(cardId);
  if (!card.password) throw { message: 'you need to activate your card before recharging', status: 422 };

  await checkCardExpiration(card);

  await rechargeRepository.insert({ cardId, amount });
}
