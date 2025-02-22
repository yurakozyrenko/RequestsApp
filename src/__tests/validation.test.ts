import { checkSchema, validationResult } from 'express-validator';
import createRequireSchema from '../helpers/validation';
import { jest } from '@jest/globals';

const mockRequest = (body: Record<string, any>) =>
  ({
    body,
  } as any);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Validation Middleware', () => {
  it('✅ Пропускает корректные данные', async () => {
    const req = mockRequest({ text: 'Пример сообщения', topic: 'Пример темы' });
    const res = mockResponse();
    const next = jest.fn();

    await Promise.all(checkSchema(createRequireSchema).map((middleware) => middleware(req, res, next)));

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('❌ Отклоняет слишком короткий текст', async () => {
    const req = mockRequest({ text: '123', topic: 'Пример темы' });
    const res = mockResponse();
    const next = jest.fn();

    await Promise.all(checkSchema(createRequireSchema).map((middleware) => middleware(req, res, next)));

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Сообщение должно быть минимум 5 cимволов');
  });
});
