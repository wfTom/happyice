import { LoginUser } from '../LoginUser';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/user';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('LoginUser', () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let loginUser: LoginUser;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    loginUser = new LoginUser(mockUserRepository);
  });

  it('should return a JWT token on successful login', async () => {
    const email = 'test@example.com';
    const password = 'Password123!';
    const hashedPassword = Password.create(password, false);
    const user = new User('1', Email.create(email), hashedPassword, new Date());

    mockUserRepository.findByEmail.mockResolvedValue(user);
    jest.spyOn(user.password, 'compare').mockReturnValue(true);
    jest.spyOn(jwt, 'sign').mockImplementation(() => 'mocked-jwt-token');

    const token = await loginUser.execute(email, password);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      Email.create(email)
    );
    expect(user.password.compare).toHaveBeenCalledWith(password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: user.id, email: user.email.value },
      process.env.JWT_SECRET || 'your-very-secret-key',
      { expiresIn: '1h' }
    );
    expect(token).toBe('mocked-jwt-token');
  });

  it('should throw an error for invalid email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const email = 'nonexistent@example.com';
    const password = 'Password123!';

    await expect(loginUser.execute(email, password)).rejects.toThrow(
      'Email ou senha incorretos'
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      Email.create(email)
    );
  });

  it('should throw an error for invalid password', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';
    const hashedPassword = Password.create('correctpassword', false);
    const user = new User('1', Email.create(email), hashedPassword, new Date());

    mockUserRepository.findByEmail.mockResolvedValue(user);
    jest.spyOn(user.password, 'compare').mockReturnValue(false);

    await expect(loginUser.execute(email, password)).rejects.toThrow(
      'Email ou senha incorretos'
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      Email.create(email)
    );
    expect(user.password.compare).toHaveBeenCalledWith(password);
  });

  it('should throw an error for invalid email format', async () => {
    const email = 'invalid-email';
    const password = 'Password123!';

    await expect(loginUser.execute(email, password)).rejects.toThrow(
      'Formato de email inválido.'
    );
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
  });
});
