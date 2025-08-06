import { User } from '../entities/user';
import { Email } from '../value-objects/email';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(email: Email): Promise<void>;
}
