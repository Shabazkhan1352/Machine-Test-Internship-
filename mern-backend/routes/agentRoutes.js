import express from 'express';
import { addAgent, getAllAgents } from '../controllers/agentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/', verifyToken, addAgent);
router.get('/', verifyToken, getAllAgents);

export default router;
