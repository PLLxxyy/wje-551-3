import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { ok } from '../utils/response.js';
import { resLocals } from '../middlewares/auth.middleware.js';

export class AuthController {
  login(req: Request, res: Response) {
    res.json(ok(authService.login(req.body.username, req.body.password)));
  }

  me(req: Request, res: Response) {
    res.json(ok(authService.me(resLocals(req).user!.id)));
  }
}

export const authController = new AuthController();
