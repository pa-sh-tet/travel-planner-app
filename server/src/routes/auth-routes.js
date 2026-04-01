import { Router } from 'express';
import { getCurrentUser, login, logout, register, updateAvatar } from '../controllers/auth-controller.js';
import { auth } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', auth, getCurrentUser);
authRouter.post('/logout', auth, logout);
authRouter.post('/avatar', auth, uploadAvatar.single('avatar'), updateAvatar);

export default authRouter;
