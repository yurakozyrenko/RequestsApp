import { NextFunction, Request, Response, Router } from 'express';
const router = Router();
import { checkSchema } from 'express-validator';
import { validationResult } from 'express-validator';

import RequestController from '../controllers/request.controller';
import createRequireSchema from '../helpers/validation';

router.post(
  '',
  checkSchema(createRequireSchema),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
  RequestController.createRequest,
);

/**
 * @swagger
 * /api/requests:
 *  get:
 *    summary: Получить все запросы
 *    description: Возвращает список всех запросов
 *    tags:
 *      - Requests
 *    responses:
 *      200:
 *        description: Успешный ответ
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    example: 1
 *                  topic:
 *                    type: string
 *                    example: "Пример темы"
 *                  text:
 *                    type: string
 *                    example: "Пример текста"
 *                  status:
 *                    type: string
 *                    example: "new"
 */

router.get('/', RequestController.getRequests);

router.get('/', RequestController.getRequests);

router.patch('/take/:id', RequestController.takeRequest);

router.patch('/complete/:id', RequestController.completeRequest);

router.patch('/cancel/:id', RequestController.cancelRequest);

router.patch('/cancel-all-in-progress', RequestController.cancelAllRequestInProgres);

export default router;
