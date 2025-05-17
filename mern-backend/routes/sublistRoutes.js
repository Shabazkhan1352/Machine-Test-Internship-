import express from 'express';
import upload from '../middlewares/upload.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { uploadList, distributeLists, getAgentList , distributeToSubagents,deleteListItem  } from '../controllers/sublistController.js';


const router = express.Router();

router.post('/upload', verifyToken, upload.single('file'), uploadList);
router.post('/distribute', verifyToken, distributeLists);
router.get('/agent/:agentId', verifyToken, getAgentList);
router.delete('/agent/:agentId', verifyToken, deleteListItem);



export default router;
