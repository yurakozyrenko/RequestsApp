import 'reflect-metadata';
import express from 'express';
import 'dotenv/config';
import AppDataSource from './config/db';
import cors from 'cors';
import router from './routes/index';
import errorHandler from './middleware/ErrorHandlingMiddleware';

const app = express();
const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 3000;
app.use(cors());

app.use(express.json());

app.use('/', router);

app.use(errorHandler);

AppDataSource.initialize().then(async () => {
  app.listen(HTTP_PORT);
});

export default app;
