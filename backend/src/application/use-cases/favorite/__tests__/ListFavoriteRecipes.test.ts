import { ListFavoriteRecipes } from '../ListFavoriteRecipes';
import { IFavoriteRepository } from '../../../../domain/repositories/IFavoriteRepository';
import { Recipe } from '../../../../domain/entities/recipe';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';
import { User } from '../../../../domain/entities/user';

describe('ListFavoriteRecipes', () => {
  let mockFavoriteRepository: jest.Mocked<IFavoriteRepository>;
  let listFavoriteRecipes: ListFavoriteRecipes;

  beforeEach(() => {
    mockFavoriteRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };
    listFavoriteRecipes = new ListFavoriteRecipes(mockFavoriteRepository);
  });

  it('should return a list of favorite recipes for a user', async () => {
    const userId = 'user123';
    const user = new User(
      userId,
      Email.create('test@example.com'),
      Password.create('password', false),
      new Date()
    );
    const recipe1 = new Recipe(
      'recipe1',
      user.id,
      'Recipe 1',
      'Desc 1',
      ['Step 1'],
      [new RecipeIngredient('recipe1', 'ing1', 'Ingredient 1', '1', 'unit', 0)],
      new Date()
    );
    const recipe2 = new Recipe(
      'recipe2',
      user.id,
      'Recipe 2',
      'Desc 2',
      ['Step 2'],
      [new RecipeIngredient('recipe2', 'ing2', 'Ingredient 2', '1', 'unit', 0)],
      new Date()
    );

    mockFavoriteRepository.findByUserId.mockResolvedValue([recipe1, recipe2]);

    const result = await listFavoriteRecipes.execute(userId);

    expect(mockFavoriteRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual([recipe1, recipe2]);
  });

  it('should return an empty array if the user has no favorite recipes', async () => {
    const userId = 'user123';

    mockFavoriteRepository.findByUserId.mockResolvedValue([]);

    const result = await listFavoriteRecipes.execute(userId);

    expect(mockFavoriteRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual([]);
  });
});
