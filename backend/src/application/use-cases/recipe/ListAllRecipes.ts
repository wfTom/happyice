import { IRecipeRepository } from '../../../domain/repositories/IRecipeRepository';
import { Recipe } from '../../../domain/entities/recipe';

export class ListAllRecipes {
  constructor(private readonly recipeRepository: IRecipeRepository) {}

  async execute(): Promise<Recipe[]> {
    return this.recipeRepository.findAll();
  }
}
