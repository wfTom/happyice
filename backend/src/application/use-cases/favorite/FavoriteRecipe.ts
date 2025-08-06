import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { IRecipeRepository } from '../../../domain/repositories/IRecipeRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class FavoriteRecipe {
  constructor(
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly userRepository: IUserRepository,
    private readonly recipeRepository: IRecipeRepository
  ) {}

  async execute(userId: string, recipeId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const recipe = await this.recipeRepository.findById(recipeId);
    if (!recipe) {
      throw new Error('Receita não encontrada');
    }

    await this.favoriteRepository.save({
      userId,
      recipeId,
      createdAt: new Date(),
    });
  }
}
