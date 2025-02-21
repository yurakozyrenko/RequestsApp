import { Request, Response } from 'express';
import requestService from '../services/request.service.js';

class RequestController {
  // 1) Создать обращение
  async createRequest(req: Request, res: Response) {
    try {
      const { topic, text }: { topic: string; text: string } = req.body;
      const response = await requestService.create(topic, text);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  //   2) Взять обращение в работу
  async takeRequest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await requestService.takeRequest(Number(id));
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  //   3) Завершить обработку обращения
  async completeRequest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { resolution } = req.body;
      const response = await requestService.completeRequest(
        Number(id),
        resolution
      );
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 4) Отмена обращения
  async cancelRequest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const response = await requestService.cancelRequest(Number(id), reason);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 5) Получить список обращений
  async getRequests(req: Request, res: Response) {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const firstDayOfMonth = new Date(new Date().setDate(1))
        .toISOString()
        .split('T')[0];

      const {
        date = today,
        from = firstDayOfMonth,
        to = today,
      } = req.query as { date?: string; from?: string; to?: string };

      const response = await requestService.getRequests(date, from, to);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 6) отменит все обращения, которые находятся в статусе "в работе"
  async cancelAllRequestInProgres(req: Request, res: Response) {
    try {
      const response = await requestService.cancelAllRequestInProgres();
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new RequestController();
