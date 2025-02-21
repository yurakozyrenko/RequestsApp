import { Between } from 'typeorm';
import AppDataSource from '../config/db.js';
import { RequestEntity, RequestStatus } from '../entities/RequestEntity.js';

const requestRepo = AppDataSource.getRepository(RequestEntity);

class RequestService {
  // 1) Создать обращение
  async create(topic: string, text: string) {
    const request = requestRepo.create({
      topic,
      text,
      status: RequestStatus.NEW,
    });
    await requestRepo.save(request);
    return request;
  }

  //   2) Взять обращение в работу
  async takeRequest(id: number) {
    const request = await requestRepo.findOneBy({ id });

    if (!request || request.status !== RequestStatus.NEW) throw new Error('Invalid request');

    request.status = RequestStatus.IN_PROGRESS;
    await requestRepo.save(request);
    return request;
  }

  //   3) Завершить обработку обращения
  async completeRequest(id: number, resolution: string) {
    const request = await requestRepo.findOneBy({ id });

    if (!request || request.status !== RequestStatus.IN_PROGRESS) throw new Error('Invalid request');

    request.status = RequestStatus.COMPLETED;
    request.resolution = resolution;
    await requestRepo.save(request);
    return request;
  }

  //   4) Отмена обращения
  async cancelRequest(id: number, reason: string) {
    const request = await requestRepo.findOneBy({ id });

    if (!request || request.status === RequestStatus.COMPLETED || request.status === RequestStatus.CANCELED)
      throw new Error('Invalid request');

    request.status = RequestStatus.CANCELED;
    request.cancelReason = reason;
    await requestRepo.save(request);
    return request;
  }

  // 5) Получить список обращений с фильтрацией по дате
  async getRequests(date: string, from: string, to: string) {
    console.log('Filter:', new Date(from), new Date(to));

    const requests = await requestRepo.find({
      //   where: {
      //     createdAt: Between(new Date(from), new Date(to)), // Правильный фильтр
      //   },
    });

    return requests;
  }

  // 6) отменит все обращения, которые находятся в статусе "в работе"
  async cancelAllRequestInProgres() {
    const result = await requestRepo.update({ status: RequestStatus.IN_PROGRESS }, { status: RequestStatus.CANCELED });

    return result.affected ?? 0;
  }
}

export default new RequestService();
