import { NextFunction, Request, Response } from 'express';
import requestService from '../services/request.service';

class RequestController {
  // 1) Создать обращение
  async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic, text }: { topic: string; text: string } = req.body;
      await requestService.create(topic, text);
      res.status(201).json({ response: 'Обращение создано' });
    } catch (error) {
      next(error);
    }
  }

  //   2) Взять обращение в работу
  async takeRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await requestService.takeRequest(Number(id));
      res.status(200).json({ response: 'Обращение принято в работу' });
    } catch (error) {
      next(error);
    }
  }

  //   3) Завершить обработку обращения
  async completeRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { resolution } = req.body;
      await requestService.completeRequest(Number(id), resolution);
      res.status(200).json({ response: 'Обработка обращения завершена' });
    } catch (error) {
      next(error);
    }
  }

  // 4) Отмена обращения
  async cancelRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { cancelReason } = req.body;
      await requestService.cancelRequest(Number(id), cancelReason);
      res.status(200).json({ response: 'Обращение отменено' });
    } catch (error) {
      next(error);
    }
  }

  // 5) Получить список обращений
  async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const date = req.query.date as string | undefined;
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;

      const response = await requestService.getAllRequests(page, limit, date, startDate, endDate);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // 6) отменит все обращения, которые находятся в статусе "в работе"
  async cancelAllRequestInProgres(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await requestService.cancelAllRequestInProgres();
      res.status(200).json({ response: `${response} обращ. в статусе в работе отменено ` });
    } catch (error) {
      next(error);
    }
  }
}

export default new RequestController();
