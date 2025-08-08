import { RecipeIngredient } from './recipe-ingredient';

export class Recipe {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public description: string,
    public steps: string[],
    public ingredients: RecipeIngredient[],
    public readonly createdAt: Date
  ) {}
}
