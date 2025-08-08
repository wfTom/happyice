import { RecipeController } from '../RecipeController';
import { Request, Response } from 'express';
import { CreateRecipe } from '../../../application/use-cases/recipe/CreateRecipe';
import { GetRecipe } from '../../../application/use-cases/recipe/GetRecipe';
import { UpdateRecipe } from '../../../application/use-cases/recipe/UpdateRecipe';
import { DeleteRecipe } from '../../../application/use-cases/recipe/DeleteRecipe';
import { SearchRecipesByName } from '../../../application/use-cases/recipe/SearchRecipesByName';
import { SearchRecipesByIngredient } from '../../../application/use-cases/recipe/SearchRecipesByIngredient';
import { ListAllRecipes } from '../../../application/use-cases/recipe/ListAllRecipes';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import { Recipe } from '../../../domain/entities/recipe';
import { RecipeIngredient } from '../../../domain/entities/recipe-ingredient';

jest.mock('../../../application/use-cases/recipe/CreateRecipe');
jest.mock('../../../application/use-cases/recipe/GetRecipe');
jest.mock('../../../application/use-cases/recipe/UpdateRecipe');
jest.mock('../../../application/use-cases/recipe/DeleteRecipe');
jest.mock('../../../application/use-cases/recipe/SearchRecipesByName');
jest.mock('../../../application/use-cases/recipe/SearchRecipesByIngredient');

describe('RecipeController', () => {
  let recipeController: RecipeController;
  let mockCreateRecipe: jest.Mocked<CreateRecipe>;
  let mockGetRecipe: jest.Mocked<GetRecipe>;
  let mockUpdateRecipe: jest.Mocked<UpdateRecipe>;
  let mockDeleteRecipe: jest.Mocked<DeleteRecipe>;
  let mockSearchRecipesByName: jest.Mocked<SearchRecipesByName>;
  let mockSearchRecipesByIngredient: jest.Mocked<SearchRecipesByIngredient>;
  let mockListAllRecipes: jest.Mocked<ListAllRecipes>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockCreateRecipe = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateRecipe>;
    mockGetRecipe = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetRecipe>;
    mockUpdateRecipe = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateRecipe>;
    mockDeleteRecipe = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteRecipe>;
    mockSearchRecipesByName = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SearchRecipesByName>;
    mockSearchRecipesByIngredient = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SearchRecipesByIngredient>;
    mockListAllRecipes = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListAllRecipes>;

    (CreateRecipe as jest.Mock).mockImplementation(() => mockCreateRecipe);
    (GetRecipe as jest.Mock).mockImplementation(() => mockGetRecipe);
    (UpdateRecipe as jest.Mock).mockImplementation(() => mockUpdateRecipe);
    (DeleteRecipe as jest.Mock).mockImplementation(() => mockDeleteRecipe);
    (SearchRecipesByName as jest.Mock).mockImplementation(
      () => mockSearchRecipesByName
    );
    (SearchRecipesByIngredient as jest.Mock).mockImplementation(
      () => mockSearchRecipesByIngredient
    );

    recipeController = new RecipeController(
      mockCreateRecipe,
      mockGetRecipe,
      mockUpdateRecipe,
      mockDeleteRecipe,
      mockSearchRecipesByName,
      mockSearchRecipesByIngredient,
      mockListAllRecipes
    );

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  describe('create', () => {
    it('should create a recipe and return 201 status', async () => {
      mockRequest.body = {
        name: 'Receita teste',
        description: 'Descrição teste',
        steps: ['Step'],
        ingredients: [],
      };
      mockRequest.user = { id: 'user123', email: 'test@example.com' };
      mockCreateRecipe.execute.mockResolvedValue(undefined);

      await recipeController.create(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockCreateRecipe.execute).toHaveBeenCalledWith(
        'user123',
        'Receita teste',
        'Descrição teste',
        ['Step'],
        []
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Receita criada com sucesso',
      });
    });

    it('should return 400 status if create recipe fails', async () => {
      mockRequest.body = {
        name: 'Receita teste',
        description: 'Descrição teste',
        steps: ['Step'],
        ingredients: [],
      };
      mockRequest.user = { id: 'user123', email: 'test@example.com' };
      mockCreateRecipe.execute.mockRejectedValue(
        new Error('Informações inválidas')
      );

      await recipeController.create(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: 'Informações inválidas',
      });
    });
  });

  describe('getById', () => {
    it('should return a recipe if found', async () => {
      const recipeId = 'recipe123';
      const mockRecipe = new Recipe(
        recipeId,
        'user123',
        'Receita teste',
        'Descrição teste',
        ['Step'],
        [new RecipeIngredient(recipeId, 'ing1', 'Ingredient 1', '1', 'unit', 0)],
        new Date()
      );
      mockRequest.params = { id: recipeId };
      mockGetRecipe.execute.mockResolvedValue(mockRecipe);

      await recipeController.getById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetRecipe.execute).toHaveBeenCalledWith(recipeId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRecipe);
    });

    it('should return 404 if recipe not found', async () => {
      const recipeId = 'nonexistent';
      mockRequest.params = { id: recipeId };
      mockGetRecipe.execute.mockResolvedValue(null);

      await recipeController.getById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetRecipe.execute).toHaveBeenCalledWith(recipeId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Receita não encontrada',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const recipeId = 'recipe123';
      mockRequest.params = { id: recipeId };
      mockGetRecipe.execute.mockRejectedValue(
        new Error('Internal server error')
      );

      await recipeController.getById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('update', () => {
    it('should update a recipe and return 200 status', async () => {
      const recipeId = 'recipe123';
      mockRequest.params = { id: recipeId };
      mockRequest.body = {
        name: 'Nome atualizado',
        description: 'Descrição atualizada',
        steps: ['Step atualizado'],
        ingredients: [],
      };
      mockUpdateRecipe.execute.mockResolvedValue(undefined);

      await recipeController.update(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockUpdateRecipe.execute).toHaveBeenCalledWith(
        recipeId,
        'Nome atualizado',
        'Descrição atualizada',
        ['Step atualizado'],
        []
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Receita atualizada com sucesso',
      });
    });

    it('should return 400 status if update fails', async () => {
      const recipeId = 'recipe123';
      mockRequest.params = { id: recipeId };
      mockRequest.body = {
        name: 'Nome atualizado',
        description: 'Descrição atualizada',
        steps: ['Step atualizado'],
        ingredients: [],
      };
      mockUpdateRecipe.execute.mockRejectedValue(
        new Error('Receita não encontrada')
      );

      await recipeController.update(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: 'Receita não encontrada',
      });
    });
  });

  describe('delete', () => {
    it('should delete a recipe and return 200 status', async () => {
      const recipeId = 'recipe123';
      mockRequest.params = { id: recipeId };
      mockDeleteRecipe.execute.mockResolvedValue(undefined);

      await recipeController.delete(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockDeleteRecipe.execute).toHaveBeenCalledWith(recipeId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Receita deletada com sucesso',
      });
    });

    it('should return 400 status if delete fails', async () => {
      const recipeId = 'recipe123';
      mockRequest.params = { id: recipeId };
      mockDeleteRecipe.execute.mockRejectedValue(
        new Error('Receita não encontrada')
      );

      await recipeController.delete(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: 'Receita não encontrada',
      });
    });
  });

  describe('searchByName', () => {
    it('should return recipes by name', async () => {
      const recipeName = 'Test';
      const mockRecipes = [
        new Recipe(
          '1',
          'user1',
          'Receita Teste',
          'Desc',
          ['Step'],
          [],
          new Date()
        ),
      ];
      mockRequest.query = { name: recipeName };
      mockSearchRecipesByName.execute.mockResolvedValue(mockRecipes);

      await recipeController.searchByName(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockSearchRecipesByName.execute).toHaveBeenCalledWith(recipeName);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRecipes);
    });

    it('should return 400 if name is missing', async () => {
      mockRequest.query = {};

      await recipeController.searchByName(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'O nome da receita é obrigatório',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const recipeName = 'Test';
      mockRequest.query = { name: recipeName };
      mockSearchRecipesByName.execute.mockRejectedValue(
        new Error('Search error')
      );

      await recipeController.searchByName(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('searchByIngredient', () => {
    it('should return recipes by ingredient', async () => {
      const ingredientName = 'Tomate';
      const mockRecipes = [
        new Recipe(
          '1',
          'user1',
          'Sopa de Tomate',
          'Desc',
          ['Step'],
          [],
          new Date()
        ),
      ];
      mockRequest.query = { ingredient: ingredientName };
      mockSearchRecipesByIngredient.execute.mockResolvedValue(mockRecipes);

      await recipeController.searchByIngredient(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockSearchRecipesByIngredient.execute).toHaveBeenCalledWith(
        ingredientName
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockRecipes);
    });

    it('should return 400 if ingredient is missing', async () => {
      mockRequest.query = {};

      await recipeController.searchByIngredient(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'O nome do ingrediente é obrigatório',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const ingredientName = 'Tomate';
      mockRequest.query = { ingredient: ingredientName };
      mockSearchRecipesByIngredient.execute.mockRejectedValue(
        new Error('Search error')
      );

      await recipeController.searchByIngredient(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });
});
