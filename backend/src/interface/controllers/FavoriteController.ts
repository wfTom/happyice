import { Response } from 'express';
import { FavoriteRecipe } from '../../application/use-cases/favorite/FavoriteRecipe';
import { UnfavoriteRecipe } from '../../application/use-cases/favorite/UnfavoriteRecipe';
import { ListFavoriteRecipes } from '../../application/use-cases/favorite/ListFavoriteRecipes';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class FavoriteController {
  constructor(
    private readonly favoriteRecipe: FavoriteRecipe,
    private readonly unfavoriteRecipe: UnfavoriteRecipe,
    private readonly listFavoriteRecipes: ListFavoriteRecipes
  ) {}

  async add(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { recipeId } = req.body;
      await this.favoriteRecipe.execute(userId, recipeId);
      res.status(201).send({ message: 'Receita favoritada com sucesso' });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  async remove(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { recipeId } = req.params;
      await this.unfavoriteRecipe.execute(userId, recipeId);
      res.status(200).send({ message: 'Receita desfavoritada com sucesso' });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const recipes = await this.listFavoriteRecipes.execute(userId);
      res.json(recipes);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
