import { Recipe } from "../entities/recipe";

export interface IRecipeRepository {
    findById(id: string): Promise<Recipe | null>;
    findAll(): Promise<Recipe[]>;
    save(recipe: Recipe): Promise<void>;
    delete(id: string): Promise<void>;
    searchByName(name: string): Promise<Recipe[]>;
    searchByIngredient(ingredientName: string): Promise<Recipe[]>;
}
