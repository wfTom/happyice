export class Favorite {
    constructor(
        public readonly userId: string,
        public readonly recipeId: string,
        public readonly createdAt: Date
    ) {}
}
