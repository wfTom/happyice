import { UnfavoriteRecipe } from '../UnfavoriteRecipe';
import { IFavoriteRepository } from '../../../../domain/repositories/IFavoriteRepository';

describe('UnfavoriteRecipe', () => {
  let mockFavoriteRepository: jest.Mocked<IFavoriteRepository>;
  let unfavoriteRecipe: UnfavoriteRecipe;

  beforeEach(() => {
    mockFavoriteRepository = {
      add: jest.fn(),
      delete: jest.fn(),
      findByUserId: jest.fn(),
      findByUserAndRecipeId: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<IFavoriteRepository>;
    unfavoriteRecipe = new UnfavoriteRecipe(mockFavoriteRepository);
  });

  it('should successfully unfavorite a recipe', async () => {
    const userId = 'user123';
    const recipeId = 'recipe123';

    await unfavoriteRecipe.execute(userId, recipeId);

    expect(mockFavoriteRepository.delete).toHaveBeenCalledWith(userId, recipeId);
  });
});
