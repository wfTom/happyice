import { ListAllRecipes } from '../ListAllRecipes';
import { IRecipeRepository } from '../../../../domain/repositories/IRecipeRepository';
import { Recipe } from '../../../../domain/entities/recipe';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';
import { User } from '../../../../domain/entities/user';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';

describe('ListAllRecipes', () => {
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
  let listAllRecipes: ListAllRecipes;

  beforeEach(() => {
    mockRecipeRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      searchByName: jest.fn(),
      searchByIngredient: jest.fn(),
      listAllRecipes: jest.fn()
    } as jest.Mocked<IRecipeRepository>;
    listAllRecipes = new ListAllRecipes(mockRecipeRepository);
  });

  it('should return all recipes', async () => {
    const user = new User(
      'user1',
      Email.create('test@example.com'),
      Password.create('password', false),
      new Date()
    );
    const mockRecipes = [
      new Recipe(
        'recipe1',
        user.id,
        'Recipe 1',
        'Description 1',
        ['Step 1'],
        [new RecipeIngredient('recipe1', 'ing1', 'Ingredient 1', '1', 'unit', 0)],
        new Date()
      ),
      new Recipe(
        'recipe2',
        user.id,
        'Recipe 2',
        'Description 2',
        ['Step 1'],
        [new RecipeIngredient('recipe2', 'ing2', 'Ingredient 2', '1', 'unit', 0)],
        new Date()
      ),
    ];

    mockRecipeRepository.findAll.mockResolvedValue(mockRecipes);

    const result = await listAllRecipes.execute();

    expect(mockRecipeRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockRecipes);
  });

  it('should return an empty array if no recipes are found', async () => {
    mockRecipeRepository.findAll.mockResolvedValue([]);

    const result = await listAllRecipes.execute();

    expect(mockRecipeRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
