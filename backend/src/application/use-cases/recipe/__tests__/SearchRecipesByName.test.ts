import { SearchRecipesByName } from '../SearchRecipesByName';
import { IRecipeRepository } from '../../../../domain/repositories/IRecipeRepository';
import { Recipe } from '../../../../domain/entities/recipe';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';
import { User } from '../../../../domain/entities/user';

describe('SearchRecipesByName', () => {
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
  let searchRecipesByName: SearchRecipesByName;

  beforeEach(() => {
    mockRecipeRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      searchByName: jest.fn(),
      searchByIngredient: jest.fn(),
    };
    searchRecipesByName = new SearchRecipesByName(mockRecipeRepository);
  });

  it('should return recipes matching the specified name', async () => {
    const recipeName = 'Pasta';
    const user = new User(
      '1',
      Email.create('test@example.com'),
      Password.create('password', false),
      new Date()
    );
    const recipe1 = new Recipe(
      'recipe1',
      user.id,
      'Pasta Carbonara',
      'Italian',
      ['step'],
      [new RecipeIngredient('recipe1', 'ing1', 'Ingredient 1', '1', 'unit', 0)],
      new Date()
    );
    const recipe2 = new Recipe(
      'recipe2',
      user.id,
      'Pasta with Pesto',
      'Italian',
      ['step'],
      [new RecipeIngredient('recipe2', 'ing2', 'Ingredient 2', '1', 'unit', 0)],
      new Date()
    );

    mockRecipeRepository.searchByName.mockResolvedValue([recipe1, recipe2]);

    const result = await searchRecipesByName.execute(recipeName);

    expect(mockRecipeRepository.searchByName).toHaveBeenCalledWith(recipeName);
    expect(result).toEqual([recipe1, recipe2]);
  });

  it('should return an empty array if no recipes match the name', async () => {
    const recipeName = 'NonExistentRecipe';

    mockRecipeRepository.searchByName.mockResolvedValue([]);

    const result = await searchRecipesByName.execute(recipeName);

    expect(mockRecipeRepository.searchByName).toHaveBeenCalledWith(recipeName);
    expect(result).toEqual([]);
  });
});
