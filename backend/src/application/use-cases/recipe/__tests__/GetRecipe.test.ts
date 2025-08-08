import { GetRecipe } from '../GetRecipe';
import { IRecipeRepository } from '../../../../domain/repositories/IRecipeRepository';
import { Recipe } from '../../../../domain/entities/recipe';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';
import { User } from '../../../../domain/entities/user';

describe('GetRecipe', () => {
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
  let getRecipe: GetRecipe;

  beforeEach(() => {
    mockRecipeRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      searchByName: jest.fn(),
      searchByIngredient: jest.fn(),
    };
    getRecipe = new GetRecipe(mockRecipeRepository);
  });

  it('should return a recipe if found', async () => {
    const recipeId = 'recipe123';
    const user = new User(
      '1',
      Email.create('test@example.com'),
      Password.create('password', false),
      new Date()
    );
    const recipe = new Recipe(
      recipeId,
      user.id,
      'Test Recipe',
      'Description',
      ['Step 1'],
      [new RecipeIngredient(recipeId, 'ing1', 'Ingredient 1', '1', 'unit', 0)],
      new Date()
    );

    mockRecipeRepository.findById.mockResolvedValue(recipe);

    const result = await getRecipe.execute(recipeId);

    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(result).toEqual(recipe);
  });

  it('should return null if recipe is not found', async () => {
    const recipeId = 'nonexistentRecipe';

    mockRecipeRepository.findById.mockResolvedValue(null);

    const result = await getRecipe.execute(recipeId);

    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(result).toBeNull();
  });
});
