import { Router } from 'express';
import axios from 'axios';
import { Request, Response } from 'express';

const usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:3002';

export const usersRouter = Router();

// Public: login + register (no auth needed)
usersRouter.post('/login', async (req: Request, res: Response) => {
  const { data } = await axios.post(`${usersServiceUrl}/auth/login`, req.body);
  res.json(data);
});

usersRouter.post('/register', async (req: Request, res: Response) => {
  const { data } = await axios.post(`${usersServiceUrl}/auth/register`, req.body);
  res.status(201).json(data);
});

// Protected: profile (auth middleware applied at router level in app.ts)
usersRouter.get('/profile', async (req: Request, res: Response) => {
  const { data } = await axios.get(`${usersServiceUrl}/users/profile`, {
    headers: { 'x-user-id': req.headers['x-user-id'] },
  });
  res.json(data);
});

usersRouter.get('/:id', async (req: Request, res: Response) => {
  const { data } = await axios.get(`${usersServiceUrl}/users/${req.params.id}`, {
    headers: { 'x-user-id': req.headers['x-user-id'] },
  });
  res.json(data);
});
