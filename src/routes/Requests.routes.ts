import { Router } from 'express';
const router = Router();

import RequestController from '../controllers/request.controller.js';

router.post('', RequestController.createRequest);

router.get('', RequestController.getRequests);

router.patch('/take/:id', RequestController.takeRequest);

router.patch('/complete/:id', RequestController.completeRequest);

router.patch('/cancel/:id', RequestController.cancelRequest);

router.patch('/cancel-all-in-progress', RequestController.cancelAllRequestInProgres);

export default router;
