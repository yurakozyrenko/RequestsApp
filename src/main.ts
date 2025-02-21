import 'reflect-metadata';
import express from 'express';
import { RequestEntity, RequestStatus } from './entities/RequestEntity.js';
import 'dotenv/config';
import AppDataSource from './config/db.js';
import cors from 'cors';
import router from './routes/index.js';

const app = express();
app.use(cors());

const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 3000;

app.use(express.json());

app.use('/', router);

AppDataSource.initialize().then(async () => {
  console.log('Database connected');

  app.listen(HTTP_PORT, () => console.log(`Server running on port ${HTTP_PORT}`));
});
