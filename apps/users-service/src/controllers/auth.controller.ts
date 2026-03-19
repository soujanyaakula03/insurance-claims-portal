import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { loginSchema, registerSchema } from '../validators/auth.validator';

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.json({ success: true, data: result });
}

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);
  const user = await authService.register(input);
  res.status(201).json({ success: true, data: user });
}

export async function getMeHandler(req: Request, res: Response): Promise<void> {
  // userId is set by auth middleware on the gateway; for direct calls, use query param
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    res.status(400).json({ success: false, error: { message: 'x-user-id header required' } });
    return;
  }
  const user = await authService.getUserById(userId);
  res.json({ success: true, data: user });
}
