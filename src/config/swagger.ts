import swaggerJsDoc from 'swagger-jsdoc';

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
      servers: [{ url: 'http://localhost:5000' }],
    },
  },
  apis: ['./dist/routes/**/*.js'], // путь к скомпилированным файлам маршрутов
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
