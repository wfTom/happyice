import { IRecipeRepository } from "../../../domain/repositories/IRecipeRepository";
import { Recipe } from "../../../domain/entities/recipe";

export class SearchRecipesByName {
    constructor(private recipeRepository: IRecipeRepository) {}

    async execute(name: string): Promise<Recipe[]> {
        return this.recipeRepository.searchByName(name);
    }
}
