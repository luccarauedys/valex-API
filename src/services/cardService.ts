import * as cardRepository from '../repositories/cardRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as companyRepository from '../repositories/companyRepository.js';
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

const cryptr = new Cryptr(process.env.SECRET_KEY);

type TransactionTypes = 'groceries' | 'restaurant' | 'transport' | 'education' | 'health';

export function checkCardType(cardType: TransactionTypes) {
  const validTypes = ['groceries', 'restaurants', 'transport', 'education', 'health'];
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

  console.log('Infos geradas:', { cardNumber, cardholderName, expirationDate, encryptedCVC });
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
  const currentDate = new Date().toLocaleDateString('pt-br');

  const currentMonth = currentDate.split('/')[1];
  const currentYear = currentDate.split('/')[2];

  const expirationDate = `${currentMonth}/${(+currentYear + 5).toString().slice(-2)}`;
  return expirationDate;
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
  const cardData = { employeeId, number: cardNumber, cardholderName, securityCode: encryptedCVC, expirationDate, isVirtual: false, isBlocked: false, type: cardType };

  return await cardRepository.insert(cardData);
}

/* 

TODO: DÚVIDAS

1. O cartão deve iniciar bloqueado e ser desbloqueado no ato da ativação e criação de senha?
2. Como saber se o cartão é virtual? Assumo que não?

*/
