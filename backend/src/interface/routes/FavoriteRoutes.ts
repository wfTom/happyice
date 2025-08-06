import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { FavoriteRecipe } from '../../application/use-cases/favorite/FavoriteRecipe';
import { UnfavoriteRecipe } from '../../application/use-cases/favorite/UnfavoriteRecipe';
import { ListFavoriteRecipes } from '../../application/use-cases/favorite/ListFavoriteRecipes';
import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRecipeRepository } from '../../domain/repositories/IRecipeRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

export const createFavoriteRoutes = (
  favoriteRepository: IFavoriteRepository,
  userRepository: IUserRepository,
  recipeRepository: IRecipeRepository
) => {
  const router = Router();

  const favoriteRecipe = new FavoriteRecipe(
    favoriteRepository,
    userRepository,
    recipeRepository
  );
  const unfavoriteRecipe = new UnfavoriteRecipe(favoriteRepository);
  const listFavoriteRecipes = new ListFavoriteRecipes(favoriteRepository);

  const favoriteController = new FavoriteController(
    favoriteRecipe,
    unfavoriteRecipe,
    listFavoriteRecipes
  );

  router.use(authMiddleware);

  router.post('/', (req, res) => favoriteController.add(req, res));
  router.delete('/:recipeId', (req, res) =>
    favoriteController.remove(req, res)
  );
  router.get('/', (req, res) => favoriteController.list(req, res));

  return router;
};
