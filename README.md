<p align="center">
  <a href="https://github.com/$username-github/$nome-repositorio">
    <img src="./readme.png" alt="readme-logo" width="80" height="80">
  </a>

  <h3 align="center">
    Valex-API
  </h3>
</p>

## Usage

```bash

$ git clone https://github.com/luccarauedys/valex-API.git

$ cd valex-API

$ npm i

$ npm run dev

```

## API:

### /card

```bash

- POST /card
    - Rota para criar um novo cartão.
    - headers: { "apiKey": "loremipsumloremipsumloremipsum" }
    - body: {
        "employeeId": "1",
        "cardType": "education"
    }

OBSERVAÇÃO: cardType só pode assumir os valores 'groceries', 'restaurant', 'transport', 'education' ou 'health'.

- POST /card/activation
    - Rota para ativar um cartão.
    - headers: {}
    - body: {
        "cardId": "1",
        "cardCVC": "123",
        "newPassword": "1234"
    }

- GET /card/financial-infos
    - Rota para visualizar saldo e transações.
    - headers: {}
    - body: {
        "cardId": "1"
    }

- PUT /card/lock
    - Rota para bloquear um cartão.
    - headers: {}
    - body: {
        "cardId": "1",
        "cardPassword": "1234"
    }

- PUT /card/unlock
    - Rota para desbloquear um cartão.
    - headers: {}
    - body: {
        "cardId": "1",
        "cardPassword": "1234"
    }

```

### /recharge

```bash

- POST /recharge
    - Rota para recarregar um cartão.
    - headers: { "apiKey": "loremipsumloremipsumloremipsum" }
    - body: {
        "cardId": "1",
        "amount": "50"
    }

- POST /payment
    - Rota para realizar uma compra em Points of Sale (maquininhas).
    - headers: {}
    - body: {
        "cardId": "1",
        "cardPassword": "1234",
        "businessId": "2",
        "amount": "25"
    }

```

### /payment

```bash

- POST /payment
    - Rota para realizar uma compra em Points of Sale (maquininhas).
    - headers: {}
    - body: {
        "cardId": "1",
        "cardPassword": "1234",
        "businessId": "2",
        "amount": "25"
    }

```
