import express from 'express';
const router = express.Router();

import requestsRoutes from './Requests.routes';
router.use('/requests', requestsRoutes);

export default router;
