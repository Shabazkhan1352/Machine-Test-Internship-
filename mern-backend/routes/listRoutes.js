import express from 'express';
import upload from '../middlewares/upload.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { uploadList, distributeLists, getAgentList } from '../controllers/listController.js';

const router = express.Router();

router.post('/upload', verifyToken, upload.single('file'), uploadList);
router.post('/distribute', verifyToken, distributeLists);
router.get('/agent/:agentId', verifyToken, getAgentList);

export default router;
