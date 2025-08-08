import { DeleteRecipe } from '../DeleteRecipe';
import { IRecipeRepository } from '../../../../domain/repositories/IRecipeRepository';
import { Recipe } from '../../../../domain/entities/recipe';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';
import { User } from '../../../../domain/entities/user';

describe('DeleteRecipe', () => {
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
  let deleteRecipe: DeleteRecipe;

  beforeEach(() => {
    mockRecipeRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      searchByName: jest.fn(),
      searchByIngredient: jest.fn(),
    };
    deleteRecipe = new DeleteRecipe(mockRecipeRepository);
  });

  it('should delete a recipe successfully', async () => {
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
      [new RecipeIngredient(recipeId, 'ing1', '1', 'unit', 0)],
      new Date()
    );

    mockRecipeRepository.findById.mockResolvedValue(recipe);
    mockRecipeRepository.delete.mockResolvedValue(undefined);

    await deleteRecipe.execute(recipeId);

    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(mockRecipeRepository.delete).toHaveBeenCalledWith(recipeId);
  });

  it('should throw an error if the recipe is not found', async () => {
    const recipeId = 'nonexistentRecipe';

    mockRecipeRepository.findById.mockResolvedValue(null);

    await expect(deleteRecipe.execute(recipeId)).rejects.toThrow(
      'Receita não encontrada'
    );
    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(mockRecipeRepository.delete).not.toHaveBeenCalled();
  });
});
