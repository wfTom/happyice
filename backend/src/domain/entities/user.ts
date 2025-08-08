import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

export class User {
  constructor(
    public readonly id: string,
    public email: Email,
    public password: Password,
    public readonly createdAt: Date
  ) {}
}
