import { Schema } from 'express-validator';

const createRequireSchema: Schema = {
  text: {
    isLength: {
      options: { min: 5 },
      errorMessage: 'Сообщение должно быть минимум 5 cимволов',
    },
  },
  topic: {
    isLength: {
      options: { min: 5 },
      errorMessage: 'Тема должна быть минимум 5 cимволов',
    },
  },
};

export default createRequireSchema