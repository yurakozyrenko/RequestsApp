import request from 'supertest';
import app from '../main';
import AppDataSource from '../config/db';


beforeAll(async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ База данных успешно инициализирована');
    }
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🛑 Соединение с базой данных закрыто');
    }
  } catch (error) {
    console.error('❌ Ошибка при закрытии соединения с БД:', error);
  }
});

describe('Requests API', () => {
  it('✅ Создаёт запрос с валидными данными', async () => {
    const res = await request(app).post('/api/requests').send({ text: 'Пример сообщения', topic: 'Пример темы' });

    expect(res.status).toBe(201);
    expect(res.body.response).toBe('Обращение успешно создано');
  });

  it('❌ Отклоняет запрос с коротким текстом', async () => {
    const res = await request(app).post('/api/requests').send({ text: '123', topic: 'Тема' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
