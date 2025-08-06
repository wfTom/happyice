import type { RecipeIngredient } from './RecipeIngredient';

export interface Recipe {
  id?: string;
  name: string;
  description: string;
  steps: string[];
  ingredients: RecipeIngredient[];
}
