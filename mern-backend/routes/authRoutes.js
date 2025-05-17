import express from 'express';
import { login,registerAdmin,loginAgent } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', login);
router.post('/register-admin', registerAdmin);

router.post('/agent-login', loginAgent);


export default router;
