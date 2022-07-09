import * as cardRepository from '../repositories/cardRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as companyRepository from '../repositories/companyRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import { format, add, compareAsc } from 'date-fns';
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

const cryptr = new Cryptr(process.env.SECRET_KEY);

type TransactionTypes = 'groceries' | 'restaurant' | 'transport' | 'education' | 'health';

export function checkCardType(cardType: TransactionTypes) {
  const validTypes = ['groceries', 'restaurant', 'transport', 'education', 'health'];
  if (!validTypes.includes(cardType)) throw { message: 'card type is not valid', status: 400 };
}

export async function checkEmployeeId(employeeId: number) {
  const employee: { id: number; fullName: string; cpf: string; email: string; companyId: number } = await employeeRepository.findById(employeeId);
  if (!employee) throw { message: 'employee not found', status: 404 };
  return employee;
}

export async function checkApiKey(apiKey: any) {
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) throw { message: 'api key is not valid or company does not have an api key', status: 401 };
}

export async function checkIfEmployeeHasCardOfThisType(cardType: TransactionTypes, employeeId: number) {
  const existingCard = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
  if (existingCard) throw { message: 'employee already has a card of this type', status: 409 };
}

export function generateCard(employeeName: string) {
  const cardNumber = generateCardNumber();
  const cardholderName = generateCardholderName(employeeName);
  const expirationDate = generateExpirationDate();
  const encryptedCVC = generateCardCVC();
  return { cardNumber, cardholderName, expirationDate, encryptedCVC };
}

export function generateCardNumber() {
  const cardNumber = faker.random.numeric(16).toString();
  return cardNumber;
}

export function generateCardholderName(employeeName: string) {
  const splittedName = employeeName.split(' ');

  const firstName = splittedName.shift();
  const lastName = splittedName.pop();

  let middleNames = '';
  for (let name of splittedName) {
    if (name.length >= 3) {
      middleNames += name[0] + ' ';
    }
  }

  const cardholderName = `${firstName} ${middleNames.trim()} ${lastName}`.toUpperCase();
  return cardholderName;
}

export function generateExpirationDate() {
  const currentDate = new Date();
  const expirationDate = add(currentDate, { years: 5 });
  return expirationDate.toString();
}

export function generateCardCVC() {
  const cardCVC = faker.random.numeric(3).toString();
  const encryptedCVC = cryptr.encrypt(cardCVC);
  return encryptedCVC;
}

export async function createCard(cardType: TransactionTypes, employeeId: number, apiKey: any) {
  checkCardType(cardType);

  const { fullName } = await checkEmployeeId(employeeId);

  await checkApiKey(apiKey);

  await checkIfEmployeeHasCardOfThisType(cardType, employeeId);

  const { cardNumber, cardholderName, expirationDate, encryptedCVC } = generateCard(fullName);

  const decryptedCVC = cryptr.decrypt(encryptedCVC);

  const cardData = { employeeId, number: cardNumber, cardholderName, securityCode: encryptedCVC, expirationDate, isVirtual: false, isBlocked: false, type: cardType };
  await cardRepository.insert(cardData);

  return { cardholderName, cardNumber, expirationDate: format(new Date(expirationDate), 'MM/yy'), securityCode: decryptedCVC, cardType };
}

export async function activateCard(cardId: string, cardCVC: string, newPassword: string) {
  await checkIfCardCanBeActivate(Number(cardId), cardCVC);
  const encryptedPassword = cryptr.encrypt(newPassword);
  await cardRepository.update(Number(cardId), { password: encryptedPassword });
}

export async function checkIfCardExists(cardId: number) {
  const card = await cardRepository.findById(cardId);
  if (!card) throw { message: 'card does not exist', status: 404 };
  return card;
}

export async function checkCardExpiration(card: cardRepository.Card) {
  const { expirationDate } = card;
  const cardExpirationDate = new Date(expirationDate);
  const currentDate = new Date();
  if (compareAsc(cardExpirationDate, currentDate) !== 1) throw { message: 'card is expired', status: 422 };
}

export async function checkIfCardIsLocked(card: cardRepository.Card) {
  if (card.isBlocked) throw { message: 'card is already locked', status: 422 };
}

export async function checkIfCardIsUnlocked(card: cardRepository.Card) {
  if (!card.isBlocked) throw { message: 'card is already unlocked', status: 422 };
}

export async function checkIfCardCVCMatches(cardCVC: string, card: cardRepository.Card) {
  const encryptedCVC = card.securityCode;
  const decryptedCVC = cryptr.decrypt(encryptedCVC);
  if (cardCVC !== decryptedCVC) throw { message: 'security code is not valid', status: 401 };
}

export async function checkIfCardPasswordMatches(cardPwd: string, card: cardRepository.Card) {
  const encryptedPwd = card.password;
  const decryptedPwd = cryptr.decrypt(encryptedPwd);
  if (cardPwd !== decryptedPwd) throw { message: 'password is not valid', status: 401 };
}

export async function checkIfCardCanBeActivate(cardId: number, cardCVC: string) {
  const card = await checkIfCardExists(cardId);
  if (card.password) throw { message: 'card is already activated', status: 422 };
  await checkCardExpiration(card);
  await checkIfCardCVCMatches(cardCVC, card);
}

export async function getCardRecharges(cardId: number) {
  return await rechargeRepository.findByCardId(cardId);
}

export async function getCardPayments(cardId: number) {
  return await paymentRepository.findByCardId(cardId);
}

export function getCardBalance(recharges: rechargeRepository.Recharge[], transactions: paymentRepository.Payment[]) {
  const rechargesSum = recharges
    .map((recharge) => recharge.amount)
    .reduce((sum, amount) => {
      return sum + amount;
    }, 0);

  const transactionsSum = transactions
    .map((transaction) => transaction.amount)
    .reduce((sum, amount) => {
      return sum + amount;
    }, 0);

  const balance = rechargesSum - transactionsSum;
  return balance;
}

export async function getCardFinancialInfos(cardId: number) {
  await checkIfCardExists(cardId);
  const recharges: rechargeRepository.Recharge[] = await getCardRecharges(cardId);
  const transactions: paymentRepository.Payment[] = await getCardPayments(cardId);
  const balance = getCardBalance(recharges, transactions);
  return { balance, transactions, recharges };
}

export async function lockCard(cardId: number, cardPassword: string) {
  const card = await checkIfCardExists(cardId);
  await checkCardExpiration(card);
  await checkIfCardIsLocked(card);
  await checkIfCardPasswordMatches(cardPassword, card);
  return await cardRepository.update(cardId, { isBlocked: true });
}

export async function unlockCard(cardId: number, cardPassword: string) {
  const card = await checkIfCardExists(cardId);
  await checkCardExpiration(card);
  await checkIfCardIsUnlocked(card);
  await checkIfCardPasswordMatches(cardPassword, card);
  return await cardRepository.update(cardId, { isBlocked: false });
}
