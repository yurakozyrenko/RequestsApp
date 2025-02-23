import { NextFunction, Request, Response, Router } from 'express';
const router = Router();
import { checkSchema } from 'express-validator';
import { validationResult } from 'express-validator';

import RequestController from '../controllers/request.controller';
import createRequireSchema from '../helpers/validation';

/**
 * @swagger
 * /api/requests:
 *  post:
 *    summary: Создать новый запрос
 *    description: Добавляет новый запрос в систему
 *    tags:
 *      - Requests
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              topic:
 *                type: string
 *                example: "Тема запроса"
 *              text:
 *                type: string
 *                example: "Текст запроса"
 *    responses:
 *      201:
 *        description: Обращение успешно создано
 *      400:
 *        description: Ошибка валидации
 *      500:
 *        description: 'Непредвиденная ошибка'
 */
router.post(
  '/',
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
 *    summary: Получить список запросов с фильтрацией и пагинацией
 *    description: Возвращает список запросов. Можно фильтровать по дате или диапазону дат и использовать пагинацию.
 *    tags:
 *      - Requests
 *    parameters:
 *      - name: date
 *        in: query
 *        description: Фильтр по конкретной дате (формат YYYY-MM-DD)
 *        schema:
 *          type: string
 *          format: date
 *      - name: startDate
 *        in: query
 *        description: Начало диапазона дат (формат YYYY-MM-DD)
 *        schema:
 *          type: string
 *          format: date
 *      - name: endDate
 *        in: query
 *        description: Конец диапазона дат (формат YYYY-MM-DD)
 *        schema:
 *          type: string
 *          format: date
 *      - name: page
 *        in: query
 *        description: Номер страницы (по умолчанию 1)
 *        schema:
 *          type: integer
 *          example: 1
 *      - name: limit
 *        in: query
 *        description: Количество элементов на странице (по умолчанию 10)
 *        schema:
 *          type: integer
 *          example: 10
 *    responses:
 *      200:
 *        description: Успешный ответ с массивом запросов
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                total:
 *                  type: integer
 *                  example: 100
 *                page:
 *                  type: integer
 *                  example: 1
 *                limit:
 *                  type: integer
 *                  example: 10
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      topic:
 *                        type: string
 *                        example: "Пример темы"
 *                      text:
 *                        type: string
 *                        example: "Пример текста"
 *                      status:
 *                        type: string
 *                        example: "new"
 *      500:
 *        description: 'Непредвиденная ошибка'
 */
router.get('/', RequestController.getRequests);

/**
 * @swagger
 * /api/requests/take/{id}:
 *  patch:
 *    summary: Взять запрос в работу
 *    description: Изменяет статус запроса на "в работе"
 *    tags:
 *      - Requests
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID запроса
 *    responses:
 *      200:
 *        description: Обращение принято в работу
 *      400:
 *        description: Обращение с ID не найдено
 *      404:
 *        description: Обращение с ID not status NEW
 *      500:
 *        description: 'Непредвиденная ошибка'
 */
router.patch('/take/:id', RequestController.takeRequest);

/**
 * @swagger
 * /api/requests/complete/{id}:
 *  patch:
 *    summary: Завершить запрос с текстом решения
 *    description: Изменяет статус запроса на "завершен" и добавляет текст с решением проблемы.
 *    tags:
 *      - Requests
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID запроса
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              solutionText:
 *                type: string
 *                example: "Проблема устранена, обновите приложение до последней версии."
 *                description: Описание решения проблемы
 *    responses:
 *      200:
 *        description: Обработка обращения завершена
 *      400:
 *        description: Обращение с ID не найдено
 *      404:
 *        description: Обращение с ID not status IN_PROGRESS
 *      500:
 *        description: Непредвиденная ошибка
 */
router.patch('/complete/:id', RequestController.completeRequest);

/**
 * @swagger
 * /api/requests/cancel/{id}:
 *  patch:
 *    summary: Отменить запрос с указанием причины
 *    description: Изменяет статус запроса на "отменен" и добавляет причину отмены.
 *    tags:
 *      - Requests
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID запроса
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              cancelReason:
 *                type: string
 *                example: "Пользователь передумал."
 *                description: Причина отмены запроса
 *    responses:
 *      200:
 *        description: Обращение отменено
 *      400:
 *        description: Некорректные данные
 *      404:
 *        description: Обращение не найдено
 *      409:
 *        description: Обращение c ID уже завершено или отменено
 *      500:
 *        description: Непредвиденная ошибка
 */
router.patch('/cancel/:id', RequestController.cancelRequest);

/**
 * @swagger
 * /api/requests/cancel-all-in-progress:
 *  patch:
 *    summary: Отменить все запросы в работе
 *    description: Отменяет все запросы, находящиеся в статусе "в работе"
 *    tags:
 *      - Requests
 *    responses:
 *      200:
 *        description: Все обращения в работе отменены
 *      500:
 *        description: Непредвиденная ошибка
 */
router.patch('/cancel-all-in-progress', RequestController.cancelAllRequestInProgres);

export default router;
