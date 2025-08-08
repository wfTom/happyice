import { UserController } from '../UserController';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Request, Response } from 'express';
import { RegisterUser } from '../../../application/use-cases/user/RegisterUser';
import { LoginUser } from '../../../application/use-cases/user/LoginUser';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';

jest.mock('../../../application/use-cases/user/RegisterUser');
jest.mock('../../../application/use-cases/user/LoginUser');

describe('UserController', () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    userController = new UserController(mockUserRepository);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    (RegisterUser as jest.Mock).mockClear();
    (LoginUser as jest.Mock).mockClear();
  });

  describe('register', () => {
    it('should register a user and return 201 status', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'Password123!' };

      (RegisterUser as jest.Mock).mockImplementation(() => {
        return {
          execute: jest.fn().mockResolvedValue(undefined),
        };
      });

      await userController.register(mockRequest as Request, mockResponse as Response);

      expect(RegisterUser).toHaveBeenCalledWith(mockUserRepository);
      expect((RegisterUser as jest.Mock).mock.results[0].value.execute).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Usuário registrado com sucesso' });
    });

    it('should return 400 status if registration fails', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'Password123!' };

      (RegisterUser as jest.Mock).mockImplementation(() => {
        return {
          execute: jest.fn().mockRejectedValue(new Error('Usuário já existe')),
        };
      });

      await userController.register(mockRequest as Request, mockResponse as Response);

      expect(RegisterUser).toHaveBeenCalledWith(mockUserRepository);
      expect((RegisterUser as jest.Mock).mock.results[0].value.execute).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Usuário já existe' });
    });
  });

  describe('login', () => {
    it('should login a user and return 200 status with token', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'Password123!' };
      const mockToken = 'mock-jwt-token';

      (LoginUser as jest.Mock).mockImplementation(() => {
        return {
          execute: jest.fn().mockResolvedValue(mockToken),
        };
      });

      await userController.login(mockRequest as Request, mockResponse as Response);

      expect(LoginUser).toHaveBeenCalledWith(mockUserRepository);
      expect((LoginUser as jest.Mock).mock.results[0].value.execute).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({ token: mockToken });
    });

    it('should return 400 status if login fails', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'Password123!' };

      (LoginUser as jest.Mock).mockImplementation(() => {
        return {
          execute: jest.fn().mockRejectedValue(new Error('Email ou senha incorretos')),
        };
      });

      await userController.login(mockRequest as Request, mockResponse as Response);

      expect(LoginUser).toHaveBeenCalledWith(mockUserRepository);
      expect((LoginUser as jest.Mock).mock.results[0].value.execute).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Email ou senha incorretos' });
    });
  });
});
