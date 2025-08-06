import { IIngredientRepository } from '../../domain/repositories/IIngredientRepository';
import { Ingredient } from '../../domain/entities/ingredient';
import { Database } from '../database/Database';

export class IngredientRepository implements IIngredientRepository {
  constructor(private readonly db: Database) {}

  async findByName(name: string): Promise<Ingredient | null> {
    const result = await this.db.query(
      'SELECT * FROM ingredients WHERE name = $1',
      [name]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const ingredientData = result.rows[0];
    return new Ingredient(ingredientData.id, ingredientData.name);
  }

  async save(ingredient: Ingredient): Promise<void> {
    await this.db.query(
      'INSERT INTO ingredients (id, name) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      [ingredient.id, ingredient.name]
    );
  }

  async findById(id: string): Promise<Ingredient | null> {
    const result = await this.db.query(
      'SELECT * FROM ingredients WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const ingredientData = result.rows[0];
    return new Ingredient(ingredientData.id, ingredientData.name);
  }

  async findSimilarByName(searchTerm: string): Promise<Ingredient[]> {
    const result = await this.db.query(
      'SELECT * FROM ingredients WHERE name ILIKE $1',
      [`%${searchTerm}%`]
    );
    return result.rows.map(
      (row) => new Ingredient(row.id, row.name)
    );
  }

  async update(ingredient: Ingredient): Promise<void> {
    await this.db.query(
      'UPDATE ingredients SET name = $1 WHERE id = $2',
      [ingredient.name, ingredient.id]
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM ingredients WHERE id = $1', [id]);
  }
}
