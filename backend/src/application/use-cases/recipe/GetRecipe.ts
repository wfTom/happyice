import { IRecipeRepository } from "../../../domain/repositories/IRecipeRepository";
import { Recipe } from "../../../domain/entities/recipe";

export class GetRecipe {
    constructor(private readonly recipeRepository: IRecipeRepository) {}

    async execute(id: string): Promise<Recipe | null> {
        return await this.recipeRepository.findById(id);
    }
}
