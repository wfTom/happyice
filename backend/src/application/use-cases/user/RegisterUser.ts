import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<void> {
    const userEmail = Email.create(email);

    const existingUser = await this.userRepository.findByEmail(userEmail);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const userPassword = Password.create(password, false);

    const newUser = new User(uuidv4(), userEmail, userPassword, new Date());

    await this.userRepository.save(newUser);
  }
}
