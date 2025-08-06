import { Request, Response } from 'express';
import { RegisterUser } from '../../application/use-cases/user/RegisterUser';
import { LoginUser } from '../../application/use-cases/user/LoginUser';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class UserController {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const registerUser = new RegisterUser(this.userRepository);
      await registerUser.execute(email, password);
      res.status(201).send({ message: 'Usuário registrado com sucesso' });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const loginUser = new LoginUser(this.userRepository);
      const token = await loginUser.execute(email, password);
      res.status(200).send({ token });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }
}
