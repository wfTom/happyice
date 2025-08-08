import { RegisterUser } from '../RegisterUser';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/user';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';

describe('RegisterUser', () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let registerUser: RegisterUser;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    registerUser = new RegisterUser(mockUserRepository);
  });

  it('should register a new user successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(undefined);

    const email = 'test@example.com';
    const password = 'Password123!';

    await registerUser.execute(email, password);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      Email.create(email)
    );
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
    const savedUser = mockUserRepository.save.mock.calls[0][0];
    expect(savedUser.email.value).toBe(email);
    expect(await savedUser.password.compare(password)).toBe(true);
  });

  it('should throw an error if the user already exists', async () => {
    const email = 'existing@example.com';
    const password = 'Password123!';
    const existingUser = new User(
      '123',
      Email.create(email),
      Password.create(password, true),
      new Date()
    );

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(registerUser.execute(email, password)).rejects.toThrow(
      'Usuário já existe'
    );
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error for invalid email format', async () => {
    const email = 'invalid-email';
    const password = 'Password123!';

    await expect(registerUser.execute(email, password)).rejects.toThrow(
      'Formato de email inválido.'
    );
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  // TODO SHOULD IMPLEMENT THIS
  it('should throw an error for invalid password format', async () => {
    const email = 'test@example.com';
    const password = 'short';

    jest.spyOn(Password, 'create').mockImplementation(() => {
      throw new Error('Password is too short');
    });

    await expect(registerUser.execute(email, password)).rejects.toThrow(
      'Password is too short'
    );
    expect(mockUserRepository.save).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
