import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Email } from '../../../domain/value-objects/email';
import * as jwt from 'jsonwebtoken';
import { UserDTO } from '../../dtos/UserDTO';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

export class LoginUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ token: string; user: UserDTO }> {
    const userEmail = Email.create(email);

    const user = await this.userRepository.findByEmail(userEmail);
    if (!user) {
      throw new Error('Email ou senha estão incorretos');
    }

    const isPasswordValid = user.password.compare(password);
    if (!isPasswordValid) {
      throw new Error('Email ou senha incorretos');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const userResponse: UserDTO = {
      id: user.id,
      email: user.email.value,
    };

    return { token, user: userResponse };
  }
}
