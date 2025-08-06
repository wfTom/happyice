import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export const createUserRoutes = (userRepository: IUserRepository) => {
  const router = Router();
  const userController = new UserController(userRepository);

  router.post('/register', (req, res) => userController.register(req, res));
  router.post('/login', (req, res) => userController.login(req, res));

  return router;
};
