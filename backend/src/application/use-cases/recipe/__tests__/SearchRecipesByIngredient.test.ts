import { SearchRecipesByIngredient } from '../SearchRecipesByIngredient';
import { IRecipeRepository } from '../../../../domain/repositories/IRecipeRepository';
import { Recipe } from '../../../../domain/entities/recipe';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';
import { User } from '../../../../domain/entities/user';

describe('SearchRecipesByIngredient', () => {
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
  let searchRecipesByIngredient: SearchRecipesByIngredient;

  beforeEach(() => {
    mockRecipeRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      searchByName: jest.fn(),
      searchByIngredient: jest.fn(),
    } as jest.Mocked<IRecipeRepository>;
    searchRecipesByIngredient = new SearchRecipesByIngredient(
      mockRecipeRepository
    );
  });

  it('should return recipes containing the specified ingredient', async () => {
    const ingredientName = 'Tomato';
    const user = new User(
      '1',
      Email.create('test@example.com'),
      Password.create('password', false),
      new Date()
    );
    const recipe1 = new Recipe(
      'recipe1',
      user.id,
      'Tomato Soup',
      'Soup',
      ['step'],
      [new RecipeIngredient('recipe1', 'ing1', 'Tomato', '1', 'unit', 0)],
      new Date()
    );
    const recipe2 = new Recipe(
      'recipe2',
      user.id,
      'Tomato Salad',
      'Salad',
      ['step'],
      [new RecipeIngredient('recipe2', 'ing2', 'Tomato', '1', 'unit', 0)],
      new Date()
    );

    mockRecipeRepository.searchByIngredient.mockResolvedValue([recipe1, recipe2]);

    const result = await searchRecipesByIngredient.execute(ingredientName);

    expect(mockRecipeRepository.searchByIngredient).toHaveBeenCalledWith(
      ingredientName
    );
    expect(result).toEqual([recipe1, recipe2]);
  });

  it('should return an empty array if no recipes contain the ingredient', async () => {
    const ingredientName = 'NonExistentIngredient';

    mockRecipeRepository.searchByIngredient.mockResolvedValue([]);

    const result = await searchRecipesByIngredient.execute(ingredientName);

    expect(mockRecipeRepository.searchByIngredient).toHaveBeenCalledWith(
      ingredientName
    );
    expect(result).toEqual([]);
  });
});
