import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

export const authRoutes = Router();
authRoutes.post('/login', (req, res) => authController.login(req, res));
authRoutes.get('/me', (req, res) => authController.me(req, res));
