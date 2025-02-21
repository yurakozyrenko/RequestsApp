import express from 'express';
const router = express.Router();

import requestsRoutes from './Requests.routes.js';
router.use('/requests', requestsRoutes);

export default router;
