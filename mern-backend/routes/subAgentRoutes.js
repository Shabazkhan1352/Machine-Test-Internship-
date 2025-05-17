import express from 'express';
import { addSubAgent,getAllSubAgents } from '../controllers/subAgentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';


const router = express.Router();
router.post('/', verifyToken, addSubAgent);
router.get('/', verifyToken, getAllSubAgents);



export default router;
