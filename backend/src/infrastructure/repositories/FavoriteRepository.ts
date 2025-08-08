import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { Favorite } from '../../domain/entities/favorite';
import { Recipe } from '../../domain/entities/recipe';
import { RecipeIngredient } from '../../domain/entities/recipe-ingredient';
import { Ingredient } from '../../domain/entities/ingredient';
import { Database } from '../database/Database';

export class FavoriteRepository implements IFavoriteRepository {
  constructor(private readonly db: Database) {}

  async save(favorite: Favorite): Promise<void> {
    await this.db.query(
      'INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [favorite.userId, favorite.recipeId]
    );
  }

  async delete(userId: string, recipeId: string): Promise<void> {
    await this.db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );
  }

  async findByUserId(userId: string): Promise<Recipe[]> {
    const result = await this.db.query(
      `SELECT
        r.id AS recipe_id,
        r.user_id AS recipe_user_id,
        r.name AS recipe_name,
        r.description AS recipe_description,
        r.steps AS recipe_steps,
        r.created_at AS recipe_created_at,
        ri.ingredient_id,
        ri.quantity,
        ri.unit,
        ri.display_order,
        i.name AS ingredient_name
      FROM favorites f
      JOIN recipes r ON f.recipe_id = r.id
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE f.user_id = $1
      ORDER BY r.id, ri.display_order`,
      [userId]
    );

    const recipesMap = new Map<string, Recipe>();

    for (const row of result.rows) {
      let recipe = recipesMap.get(row.recipe_id);

      if (!recipe) {
        recipe = new Recipe(
          row.recipe_id,
          row.recipe_user_id,
          row.recipe_name,
          row.recipe_description,
          row.recipe_steps,
          [],
          row.recipe_created_at
        );
        recipesMap.set(row.recipe_id, recipe);
      }

      if (row.ingredient_id) {
        // TODO verify, may need to create another object to return name of ingredients together with favorite recipe
        const ingredient = new Ingredient(
          row.ingredient_id,
          row.ingredient_name
        );
        const recipeIngredient = new RecipeIngredient(
          row.recipe_id,
          row.ingredient_id,
          row.ingredient_name,
          row.quantity,
          row.unit,
          row.display_order
        );
        recipe.ingredients.push(recipeIngredient);
      }
    }

    return Array.from(recipesMap.values());
  }
}
