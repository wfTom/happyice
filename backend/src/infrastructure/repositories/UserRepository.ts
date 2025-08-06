import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/user';
import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { Database } from '../database/Database';

export class UserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findByEmail(email: Email): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (result.rows.length === 0) {
      return null;
    }
    const userData = result.rows[0];
    const userEmail = Email.create(userData.email);
    const userPassword = Password.create(userData.password, true);
    return new User(userData.id, userEmail, userPassword, userData.created_at);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return null;
    }
    const userData = result.rows[0];
    const userEmail = Email.create(userData.email);
    const userPassword = Password.create(userData.password, true);
    return new User(userData.id, userEmail, userPassword, userData.created_at);
  }

  async save(user: User): Promise<void> {
    await this.db.query(
      'INSERT INTO users (id, email, password, created_at) VALUES ($1, $2, $3, $4)',
      [user.id, user.email.value, user.password.value, user.createdAt]
    );
  }

  async delete(email: Email): Promise<void> {
    await this.db.query('DELETE FROM users WHERE email = $1', [email.value]);
  }
}
