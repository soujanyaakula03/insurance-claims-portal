import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function getUserByIdHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await authService.getUserById(id);
  res.json({ success: true, data: user });
}

export async function getProfileHandler(req: Request, res: Response): Promise<void> {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    res.status(400).json({ success: false, error: { message: 'x-user-id header required' } });
    return;
  }
  const user = await authService.getUserById(userId);
  res.json({ success: true, data: user });
}
