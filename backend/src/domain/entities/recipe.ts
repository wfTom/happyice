import { RecipeIngredient } from "./recipe-ingredient";

export class Recipe {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly steps: string[],
        public readonly ingredients: RecipeIngredient[],
        public readonly createdAt: Date
    ) {}
}
