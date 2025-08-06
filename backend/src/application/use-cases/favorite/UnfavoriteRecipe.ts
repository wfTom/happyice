import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';

export class UnfavoriteRecipe {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(userId: string, recipeId: string): Promise<void> {
    await this.favoriteRepository.delete(userId, recipeId);
  }
}
