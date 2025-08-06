import { Ingredient } from "../entities/ingredient";

export interface IIngredientRepository {
    findById(id: string): Promise<Ingredient | null>;
    findByName(name: string): Promise<Ingredient | null>;
    findSimilarByName(searchTerm: string): Promise<Ingredient[]>;
    save(ingredient: Ingredient): Promise<void>;
    update(ingredient: Ingredient): Promise<void>;
    delete(id: string): Promise<void>;
}
