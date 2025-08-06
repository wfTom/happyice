import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { Recipe } from '../../../domain/entities/recipe';

export class ListFavoriteRecipes {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(userId: string): Promise<Recipe[]> {
    return await this.favoriteRepository.findByUserId(userId);
  }
}
