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

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Документация',
      version: '1.0.0',
      description: 'Документация API для Express-приложения.',
      contact: {
        name: 'Yura Kazyrenka',
      },
      servers: ['http://localhost:5000'],
    },
  },
  apis: ['./routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);

AppDataSource.initialize().then(async () => {
  app.listen(HTTP_PORT);
});

export default app;
