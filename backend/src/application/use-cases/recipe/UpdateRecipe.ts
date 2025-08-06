import { IRecipeRepository } from '../../../domain/repositories/IRecipeRepository';
import { IIngredientRepository } from '../../../domain/repositories/IIngredientRepository';
import { Recipe } from '../../../domain/entities/recipe';
import { Ingredient } from '../../../domain/entities/ingredient';
import { RecipeIngredient } from '../../../domain/entities/recipe-ingredient';
import { v4 as uuidv4 } from 'uuid';

interface IngredientInput {
  name: string;
  quantity: string;
  unit: string;
}

export class UpdateRecipe {
  constructor(
    private readonly recipeRepository: IRecipeRepository,
    private readonly ingredientRepository: IIngredientRepository
  ) {}

  async execute(
    id: string,
    name: string,
    description: string,
    steps: string[],
    ingredients: IngredientInput[]
  ): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);

    if (!recipe) {
      throw new Error('Receita não encontrada');
    }

    const recipeIngredients = await Promise.all(
      ingredients.map(async (ing, index) => {
        let ingredient = await this.ingredientRepository.findByName(ing.name);

        if (!ingredient) {
          ingredient = new Ingredient(uuidv4(), ing.name);
          await this.ingredientRepository.save(ingredient);
        }

        return new RecipeIngredient(
          id,
          ingredient.id,
          ing.quantity,
          ing.unit,
          index
        );
      })
    );

    const updatedRecipe = new Recipe(
      id,
      recipe.userId,
      name,
      description,
      steps,
      recipeIngredients,
      recipe.createdAt
    );

    await this.recipeRepository.save(updatedRecipe);
  }
}
