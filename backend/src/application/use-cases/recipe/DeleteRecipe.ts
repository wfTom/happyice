import { IRecipeRepository } from '../../../domain/repositories/IRecipeRepository';

export class DeleteRecipe {
  constructor(private readonly recipeRepository: IRecipeRepository) {}

  async execute(id: string): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new Error('Receita não encontrada');
    }
    await this.recipeRepository.delete(id);
  }
}
