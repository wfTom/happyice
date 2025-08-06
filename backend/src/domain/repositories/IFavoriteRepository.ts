import { Favorite } from "../entities/favorite";
import { Recipe } from "../entities/recipe";

export interface IFavoriteRepository {
    findByUserId(userId: string): Promise<Recipe[]>;
    save(favorite: Favorite): Promise<void>;
    delete(userId: string, recipeId: string): Promise<void>;
}
