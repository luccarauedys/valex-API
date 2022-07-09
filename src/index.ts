import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import router from './routers/index.js';
import errorHandler from './middlewares/errorHandlerMiddleware.js';

const app = express().use(json()).use(cors());
app.use(router);
app.use(errorHandler);

const PORT = +process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
