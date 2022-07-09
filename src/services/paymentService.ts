import * as paymentRepository from '../repositories/paymentRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { checkIfCardExists, checkCardExpiration, checkIfCardPasswordMatches, getCardFinancialInfos } from './cardService.js';

export async function payment(cardId: number, cardPassword: string, businessId: number, amount: number) {
  const card = await checkIfCardExists(cardId);

  if (!card.password) throw { message: 'activate your card before making a purchase', status: 401 };

  if (card.isBlocked) throw { message: 'you need to unlock your card before making a purchase', status: 401 };

  await checkCardExpiration(card);

  await checkIfCardPasswordMatches(cardPassword, card);

  await checkBalance(cardId, amount);

  await checkBusiness(businessId, card);

  return await paymentRepository.insert({ cardId, businessId, amount });
}

export async function checkBalance(cardId: number, amount: number) {
  const { balance } = await getCardFinancialInfos(cardId);
  if (balance < amount) throw { message: 'you do not have enough balance', status: 401 };
}

export async function checkBusiness(businessId: number, card: cardRepository.Card) {
  const business = await businessRepository.findById(businessId);

  if (!business) throw { message: 'purchase is only allowed in registered establishments', status: 401 };

  if (card.type !== business.type) throw { message: 'only establishments of the same type as the card can transact with it', status: 401 };
}
