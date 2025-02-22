import request from 'supertest';
import app from '../main';

describe('Requests API', () => {
  it('✅ Создаёт запрос с валидными данными', async () => {
    const res = await request(app).post('/requests').send({ text: 'Пример сообщения', topic: 'Пример темы' });

    console.log('📩 Ответ сервера:', res.body);
    console.log('📡 HTTP статус:', res.status);

    expect(res.status).toBe(201);
    expect(res.body.response).toBe('Обращение создано');
  });

  it('❌ Отклоняет запрос с коротким текстом', async () => {
    const res = await request(app).post('/requests').send({ text: '123', topic: 'Тема' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
