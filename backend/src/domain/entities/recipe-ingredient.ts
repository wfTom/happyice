export class RecipeIngredient {
  constructor(
    public readonly recipeId: string,
    public readonly ingredientId: string,
    public name: string,
    public quantity: string,
    public unit: string,
    public displayOrder: number
  ) {}
}
