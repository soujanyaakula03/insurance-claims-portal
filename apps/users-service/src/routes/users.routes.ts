import { Router } from 'express';
import { getUserByIdHandler, getProfileHandler } from '../controllers/users.controller';

export const usersRouter = Router();

usersRouter.get('/profile', getProfileHandler);
usersRouter.get('/:id', getUserByIdHandler);
