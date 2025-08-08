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

export class CreateRecipe {
  constructor(
    private readonly recipeRepository: IRecipeRepository,
    private readonly ingredientRepository: IIngredientRepository
  ) {}

  async execute(
    userId: string,
    name: string,
    description: string,
    steps: string[],
    ingredients: IngredientInput[]
  ): Promise<void> {
    const recipeId = uuidv4();

    const recipeIngredients = await Promise.all(
      ingredients.map(async (ing, index) => {
        let ingredient = await this.ingredientRepository.findByName(ing.name);

        if (!ingredient) {
          ingredient = new Ingredient(uuidv4(), ing.name);
          await this.ingredientRepository.save(ingredient);
        }

        return new RecipeIngredient(
          recipeId,
          ingredient.id,
          ing.name,
          ing.quantity,
          ing.unit,
          index
        );
      })
    );

    const newRecipe = new Recipe(
      recipeId,
      userId,
      name,
      description,
      steps,
      recipeIngredients,
      new Date()
    );

    await this.recipeRepository.save(newRecipe);
  }
}
