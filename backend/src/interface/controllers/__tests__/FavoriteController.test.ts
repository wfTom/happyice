import { FavoriteController } from '../FavoriteController';
import { Request, Response } from 'express';
import { FavoriteRecipe } from '../../../application/use-cases/favorite/FavoriteRecipe';
import { UnfavoriteRecipe } from '../../../application/use-cases/favorite/UnfavoriteRecipe';
import { ListFavoriteRecipes } from '../../../application/use-cases/favorite/ListFavoriteRecipes';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import { Recipe } from '../../../domain/entities/recipe';
import { RecipeIngredient } from '../../../domain/entities/recipe-ingredient';

jest.mock('../../../application/use-cases/favorite/FavoriteRecipe');
jest.mock('../../../application/use-cases/favorite/UnfavoriteRecipe');
jest.mock('../../../application/use-cases/favorite/ListFavoriteRecipes');

describe('FavoriteController', () => {
  let favoriteController: FavoriteController;
  let mockFavoriteRecipe: jest.Mocked<FavoriteRecipe>;
  let mockUnfavoriteRecipe: jest.Mocked<UnfavoriteRecipe>;
  let mockListFavoriteRecipes: jest.Mocked<ListFavoriteRecipes>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockFavoriteRecipe = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FavoriteRecipe>;
    mockUnfavoriteRecipe = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UnfavoriteRecipe>;
    mockListFavoriteRecipes = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListFavoriteRecipes>;

    (FavoriteRecipe as jest.Mock).mockImplementation(() => mockFavoriteRecipe);
    (UnfavoriteRecipe as jest.Mock).mockImplementation(
      () => mockUnfavoriteRecipe
    );
    (ListFavoriteRecipes as jest.Mock).mockImplementation(
      () => mockListFavoriteRecipes
    );

    favoriteController = new FavoriteController(
      mockFavoriteRecipe,
      mockUnfavoriteRecipe,
      mockListFavoriteRecipes
    );

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  describe('add', () => {
    it('should add a favorite recipe and return 201 status', async () => {
      mockRequest.user = { id: 'user123', email: 'test@example.com' };
      mockRequest.body = { recipeId: 'recipe123' };
      mockFavoriteRecipe.execute.mockResolvedValue(undefined);

      await favoriteController.add(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockFavoriteRecipe.execute).toHaveBeenCalledWith(
        'user123',
        'recipe123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Receita favoritada com sucesso',
      });
    });

    it('should return 400 status if adding favorite fails', async () => {
      mockRequest.user = { id: 'user123', email: 'test@example.com' };
      mockRequest.body = { recipeId: 'recipe123' };
      mockFavoriteRecipe.execute.mockRejectedValue(
        new Error('Receita já favoritada')
      );

      await favoriteController.add(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: 'Receita já favoritada',
      });
    });
  });

  describe('remove', () => {
    it('should remove a favorite recipe and return 200 status', async () => {
      mockRequest.user = { id: 'user123', email: 'test@example.com' };
      mockRequest.params = { recipeId: 'recipe123' };
      mockUnfavoriteRecipe.execute.mockResolvedValue(undefined);

      await favoriteController.remove(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockUnfavoriteRecipe.execute).toHaveBeenCalledWith(
        'user123',
        'recipe123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Receita desfavoritada com sucesso',
      });
    });

    it('should return 400 status if removing favorite fails', async () => {
      mockRequest.user = { id: 'user123', email: 'test@example.com' };
      mockRequest.params = { recipeId: 'recipe123' };
      mockUnfavoriteRecipe.execute.mockRejectedValue(
        new Error('Receita não encontrada')
      );

      await favoriteController.remove(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: 'Receita não encontrada',
      });
    });
  });

  describe('list', () => {
    it('should return a list of favorite recipes', async () => {
      const userId = 'user123';
      const mockRecipes = [
        new Recipe(
          '1',
          userId,
          'Receita 1',
          'Desc 1',
          ['Step 1'],
          [new RecipeIngredient('1', 'ing1', '1', 'unit', 0)],
          new Date()
        ),
      ];
      mockRequest.user = { id: userId, email: 'test@example.com' };
      mockListFavoriteRecipes.execute.mockResolvedValue(mockRecipes);

      await favoriteController.list(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockListFavoriteRecipes.execute).toHaveBeenCalledWith(userId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRecipes);
    });

    it('should return 500 status if listing favorites fails', async () => {
      const userId = 'user123';
      mockRequest.user = { id: userId, email: 'test@example.com' };
      mockListFavoriteRecipes.execute.mockRejectedValue(
        new Error('Database error')
      );

      await favoriteController.list(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });
});
