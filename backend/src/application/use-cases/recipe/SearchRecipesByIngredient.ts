import { IRecipeRepository } from "../../../domain/repositories/IRecipeRepository";
import { Recipe } from "../../../domain/entities/recipe";

export class SearchRecipesByIngredient {
    constructor(private recipeRepository: IRecipeRepository) {}

    async execute(ingredientName: string): Promise<Recipe[]> {
        return this.recipeRepository.searchByIngredient(ingredientName);
    }
}
