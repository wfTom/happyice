import { FavoriteRecipe } from '../FavoriteRecipe';
import { IFavoriteRepository } from '../../../../domain/repositories/IFavoriteRepository';
import { IRecipeRepository } from '../../../../domain/repositories/IRecipeRepository';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/user';
import { Recipe } from '../../../../domain/entities/recipe';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';

describe('FavoriteRecipe', () => {
  let mockFavoriteRepository: jest.Mocked<IFavoriteRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
  let favoriteRecipe: FavoriteRecipe;

  beforeEach(() => {
    mockFavoriteRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;
    mockRecipeRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findByIngredient: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchByName: jest.fn(),
      searchByIngredient: jest.fn(),
    } as jest.Mocked<IRecipeRepository>;
    favoriteRecipe = new FavoriteRecipe(
      mockFavoriteRepository,
      mockUserRepository,
      mockRecipeRepository
    );
  });

  it('should favorite a recipe successfully', async () => {
    const userId = 'user123';
    const recipeId = 'recipe123';
    const user = new User(
      userId,
      Email.create('test@example.com'),
      Password.create('password', false),
      new Date()
    );
    const recipe = new Recipe(
      recipeId,
      userId,
      'Test Recipe',
      'Description',
      ['Step 1'],
      [new RecipeIngredient(recipeId, 'ing1', '1', 'unit', 0)],
      new Date()
    );

    mockUserRepository.findById.mockResolvedValue(user);
    mockRecipeRepository.findById.mockResolvedValue(recipe);
    mockFavoriteRepository.save.mockResolvedValue(undefined);

    await favoriteRecipe.execute(userId, recipeId);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(mockFavoriteRepository.save).toHaveBeenCalledWith({
      userId,
      recipeId,
      createdAt: expect.any(Date),
    });
  });

  it('should throw an error if user is not found', async () => {
    const userId = 'nonexistentUser';
    const recipeId = 'recipe123';

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(favoriteRecipe.execute(userId, recipeId)).rejects.toThrow(
      'Usuário não encontrado'
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockRecipeRepository.findById).not.toHaveBeenCalled();
    expect(mockFavoriteRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if recipe is not found', async () => {
    const userId = 'user123';
    const recipeId = 'nonexistentRecipe';
    const user = new User(
      userId,
      Email.create('test@example.com'),
      Password.create('password', false),
      new Date()
    );

    mockUserRepository.findById.mockResolvedValue(user);
    mockRecipeRepository.findById.mockResolvedValue(null);

    await expect(favoriteRecipe.execute(userId, recipeId)).rejects.toThrow(
      'Receita não encontrada'
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(mockFavoriteRepository.save).not.toHaveBeenCalled();
  });
});
