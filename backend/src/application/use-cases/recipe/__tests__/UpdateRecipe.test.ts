import { UpdateRecipe } from '../UpdateRecipe';
import { IRecipeRepository } from '../../../../domain/repositories/IRecipeRepository';
import { IIngredientRepository } from '../../../../domain/repositories/IIngredientRepository';
import { Recipe } from '../../../../domain/entities/recipe';
import { Ingredient } from '../../../../domain/entities/ingredient';
import { RecipeIngredient } from '../../../../domain/entities/recipe-ingredient';

describe('UpdateRecipe', () => {
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
  let mockIngredientRepository: jest.Mocked<IIngredientRepository>;
  let updateRecipe: UpdateRecipe;

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
    updateRecipe = new UpdateRecipe(
      mockRecipeRepository,
      mockIngredientRepository
    );
  });

  it('should update an existing recipe and its ingredients', async () => {
    const recipeId = 'recipe123';
    const userId = 'user123';
    const oldRecipe = new Recipe(
      recipeId,
      userId,
      'Old Name',
      'Old Description',
      ['Old Step'],
      [
        new RecipeIngredient(
          recipeId,
          'oldIng',
          'Old Ingredient',
          '1',
          'unit',
          0
        ),
      ],
      new Date()
    );

    const newName = 'New Name';
    const newDescription = 'New Description';
    const newSteps = ['New Step 1', 'New Step 2'];
    const newIngredients = [
      { name: 'New Ingredient A', quantity: '100', unit: 'g' },
      { name: 'Existing Ingredient', quantity: '50', unit: 'ml' },
    ];

    mockRecipeRepository.findById.mockResolvedValue(oldRecipe);
    mockIngredientRepository.findByName.mockImplementation(
      async (name: string) => {
        if (name === 'Existing Ingredient') {
          return new Ingredient('existingIngId', 'Existing Ingredient');
        }
        return null;
      }
    );

    mockIngredientRepository.save.mockImplementation(
      async (ingredient: Ingredient) => {}
    );

    await updateRecipe.execute(
      recipeId,
      newName,
      newDescription,
      newSteps,
      newIngredients
    );

    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(mockIngredientRepository.findByName).toHaveBeenCalledTimes(2);
    expect(mockIngredientRepository.save).toHaveBeenCalledTimes(1); // Only for 'New Ingredient A'
    expect(mockRecipeRepository.save).toHaveBeenCalledTimes(1);

    const savedRecipe = mockRecipeRepository.save.mock.calls[0][0];
    expect(savedRecipe).toBeInstanceOf(Recipe);
    expect(savedRecipe.id).toBe(recipeId);
    expect(savedRecipe.name).toBe(newName);
    expect(savedRecipe.description).toBe(newDescription);
    expect(savedRecipe.steps).toEqual(newSteps);
    expect(savedRecipe.ingredients.length).toBe(2);
    expect(savedRecipe.ingredients[0].ingredientId).not.toBeNull();
    expect(savedRecipe.ingredients[1].ingredientId).toBe('existingIngId');
  });

  it('should throw an error if the recipe is not found', async () => {
    const recipeId = 'nonexistentRecipe';
    const newName = 'New Name';
    const newDescription = 'New Description';
    const newSteps = ['New Step 1'];
    const newIngredients = [
      { name: 'Ingredient', quantity: '1', unit: 'unit' },
    ];

    mockRecipeRepository.findById.mockResolvedValue(null);

    await expect(
      updateRecipe.execute(
        recipeId,
        newName,
        newDescription,
        newSteps,
        newIngredients
      )
    ).rejects.toThrow('Receita não encontrada');
    expect(mockRecipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(mockIngredientRepository.findByName).not.toHaveBeenCalled();
    expect(mockIngredientRepository.save).not.toHaveBeenCalled();
    expect(mockRecipeRepository.save).not.toHaveBeenCalled();
  });
});
