export class RecipeIngredient {
    constructor(
        public readonly recipeId: string,
        public readonly ingredientId: string,
        public readonly quantity: string,
        public readonly unit: string,
        public readonly displayOrder: number
    ) {}
}
