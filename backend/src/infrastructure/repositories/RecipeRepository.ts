import { IRecipeRepository } from '../../domain/repositories/IRecipeRepository';
import { Recipe } from '../../domain/entities/recipe';
import { Database } from '../database/Database';
import { RecipeIngredient } from '../../domain/entities/recipe-ingredient';

export class RecipeRepository implements IRecipeRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  private mapRowsToRecipes(rows: any[]): Recipe[] {
    const recipesMap = new Map<string, Recipe>();

    for (const row of rows) {
      if (!recipesMap.has(row.id)) {
        recipesMap.set(
          row.id,
          new Recipe(
            row.id,
            row.user_id,
            row.name,
            row.description,
            row.steps,
            [],
            row.created_at
          )
        );
      }

      if (row.ingredient_id) {
        const recipe = recipesMap.get(row.id)!;
        recipe.ingredients.push(
          new RecipeIngredient(
            row.id,
            row.ingredient_id,
            row.ingredient_quantity,
            row.ingredient_unit,
            row.ingredient_order ?? 0
          )
        );
      }
    }
    return Array.from(recipesMap.values());
  }

  async findById(id: string): Promise<Recipe | null> {
    const query = `
      SELECT
          r.id, r.user_id, r.name, r.description, r.steps, r.created_at,
          i.id AS ingredient_id, i.name AS ingredient_name,
          ri.quantity AS ingredient_quantity, ri.unit AS ingredient_unit
      FROM
          recipes r
      LEFT JOIN
          recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN
          ingredients i ON ri.ingredient_id = i.id
      WHERE
          r.id = $1
      ORDER BY
          ri.display_order;
    `;
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const recipes = this.mapRowsToRecipes(result.rows);
    return recipes[0];
  }

  async findAll(): Promise<Recipe[]> {
    const query = `
      SELECT
          r.id, r.user_id, r.name, r.description, r.steps, r.created_at,
          i.id AS ingredient_id, i.name AS ingredient_name,
          ri.quantity AS ingredient_quantity, ri.unit AS ingredient_unit
      FROM
          recipes r
      LEFT JOIN
          recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN
          ingredients i ON ri.ingredient_id = i.id
      ORDER BY
          r.created_at DESC, ri.display_order;
    `;
    const result = await this.db.query(query);
    return this.mapRowsToRecipes(result.rows);
  }

  async save(recipe: Recipe): Promise<void> {
    await this.db.query(
      'INSERT INTO recipes (id, user_id, name, description, steps, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id, name = EXCLUDED.name, description = EXCLUDED.description, steps = EXCLUDED.steps',
      [
        recipe.id,
        recipe.userId,
        recipe.name,
        recipe.description,
        recipe.steps,
        recipe.createdAt,
      ]
    );

    await this.db.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [
      recipe.id,
    ]);

    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ing = recipe.ingredients[i];
      await this.db.query(
        'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, display_order) VALUES ($1, $2, $3, $4, $5)',
        [recipe.id, ing.ingredientId, ing.quantity, ing.unit, i]
      );
    }
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM recipes WHERE id = $1', [id]);
  }

  async searchByName(name: string): Promise<Recipe[]> {
    const query = `
        SELECT
            r.id, r.user_id, r.name, r.description, r.steps, r.created_at,
            i.id AS ingredient_id, i.name AS ingredient_name,
            ri.quantity AS ingredient_quantity, ri.unit AS ingredient_unit
        FROM
            recipes r
        LEFT JOIN
            recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN
            ingredients i ON ri.ingredient_id = i.id
        WHERE
            r.name ILIKE $1
        ORDER BY
            r.created_at DESC, ri.display_order;
    `;
    const result = await this.db.query(query, [`%${name}%`]);
    return this.mapRowsToRecipes(result.rows);
  }

  async searchByIngredient(ingredientName: string): Promise<Recipe[]> {
    const query = `
      SELECT
          r.id, r.user_id, r.name, r.description, r.steps, r.created_at,
          i.id AS ingredient_id, i.name AS ingredient_name,
          ri.quantity AS ingredient_quantity, ri.unit AS ingredient_unit
      FROM
          recipes r
      LEFT JOIN
          recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN
          ingredients i ON ri.ingredient_id = i.id
      WHERE
          r.id IN (
              SELECT r2.id
              FROM recipes r2
              JOIN recipe_ingredients ri2 ON r2.id = ri2.recipe_id
              JOIN ingredients i2 ON ri2.ingredient_id = i2.id
              WHERE i2.name ILIKE $1
          )
      ORDER BY
          r.created_at DESC, ri.display_order;
    `;
    const result = await this.db.query(query, [`%${ingredientName}%`]);
    return this.mapRowsToRecipes(result.rows);
  }
}
