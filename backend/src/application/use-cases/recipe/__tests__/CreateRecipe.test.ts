import { CreateRecipe } from '../CreateRecipe';
import { IRecipeRepository } from '../../../../domain/repositories/IRecipeRepository';
import { IIngredientRepository } from '../../../../domain/repositories/IIngredientRepository';
import { Recipe } from '../../../../domain/entities/recipe';
import { Ingredient } from '../../../../domain/entities/ingredient';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';

describe('CreateRecipe', () => {
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
  let mockIngredientRepository: jest.Mocked<IIngredientRepository>;
  let createRecipe: CreateRecipe;

  beforeEach(() => {
    mockRecipeRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      searchByName: jest.fn(),
      searchByIngredient: jest.fn(),
    };
    mockIngredientRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findSimilarByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createRecipe = new CreateRecipe(
      mockRecipeRepository,
      mockIngredientRepository
    );
  });

  it('should create a new recipe and save it', async () => {
    const userId = 'user123';
    const name = 'Test Recipe';
    const description = 'A delicious test recipe.';
    const steps = ['Step 1', 'Step 2'];
    const ingredients = [
      { name: 'Ingredient A', quantity: '100', unit: 'g' },
      { name: 'Ingredient B', quantity: '2', unit: 'pcs' },
    ];

    mockIngredientRepository.findByName.mockResolvedValue(null);
    mockIngredientRepository.save.mockImplementation(
      async (ingredient: Ingredient) => { /* do nothing */ }
    );

    await createRecipe.execute(userId, name, description, steps, ingredients);

    expect(mockIngredientRepository.findByName).toHaveBeenCalledTimes(2);
    expect(mockIngredientRepository.save).toHaveBeenCalledTimes(2);
    expect(mockRecipeRepository.save).toHaveBeenCalledTimes(1);

    const savedRecipe = mockRecipeRepository.save.mock.calls[0][0];
    expect(savedRecipe).toBeInstanceOf(Recipe);
    expect(savedRecipe.userId).toBe(userId);
    expect(savedRecipe.name).toBe(name);
    expect(savedRecipe.description).toBe(description);
    expect(savedRecipe.steps).toEqual(steps);
    expect(savedRecipe.ingredients.length).toBe(2);
    expect(savedRecipe.ingredients[0]).toBeInstanceOf(RecipeIngredient);
    expect(savedRecipe.ingredients[1]).toBeInstanceOf(RecipeIngredient);
  });

  it('should use existing ingredients if they already exist', async () => {
    const userId = 'user123';
    const name = 'Test Recipe';
    const description = 'A delicious test recipe.';
    const steps = ['Step 1', 'Step 2'];
    const ingredients = [
      { name: 'Existing Ingredient', quantity: '50', unit: 'ml' },
    ];

    const existingIngredient = new Ingredient('ing123', 'Existing Ingredient');
    mockIngredientRepository.findByName.mockResolvedValue(existingIngredient);

    await createRecipe.execute(userId, name, description, steps, ingredients);

    expect(mockIngredientRepository.findByName).toHaveBeenCalledTimes(1);
    expect(mockIngredientRepository.save).not.toHaveBeenCalled();
    expect(mockRecipeRepository.save).toHaveBeenCalledTimes(1);

    const savedRecipe = mockRecipeRepository.save.mock.calls[0][0];
    expect(savedRecipe.ingredients[0].ingredientId).toBe(existingIngredient.id);
  });
});
