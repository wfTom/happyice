import { Router } from 'express';
import { RecipeController } from '../controllers/RecipeController';
import { CreateRecipe } from '../../application/use-cases/recipe/CreateRecipe';
import { GetRecipe } from '../../application/use-cases/recipe/GetRecipe';
import { UpdateRecipe } from '../../application/use-cases/recipe/UpdateRecipe';
import { DeleteRecipe } from '../../application/use-cases/recipe/DeleteRecipe';
import { SearchRecipesByName } from '../../application/use-cases/recipe/SearchRecipesByName';
import { SearchRecipesByIngredient } from '../../application/use-cases/recipe/SearchRecipesByIngredient';
import { IRecipeRepository } from '../../domain/repositories/IRecipeRepository';
import { IIngredientRepository } from '../../domain/repositories/IIngredientRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

export const createRecipeRoutes = (
  recipeRepository: IRecipeRepository,
  ingredientRepository: IIngredientRepository
) => {
  const router = Router();

  const createRecipe = new CreateRecipe(recipeRepository, ingredientRepository);
  const getRecipe = new GetRecipe(recipeRepository);
  const updateRecipe = new UpdateRecipe(recipeRepository, ingredientRepository);
  const deleteRecipe = new DeleteRecipe(recipeRepository);
  const searchRecipesByName = new SearchRecipesByName(recipeRepository);
  const searchRecipesByIngredient = new SearchRecipesByIngredient(
    recipeRepository
  );

  const recipeController = new RecipeController(
    createRecipe,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipesByName,
    searchRecipesByIngredient
  );

  router.use(authMiddleware);

  router.post('/', (req, res) => recipeController.create(req, res));
  router.get('/:id', (req, res) => recipeController.getById(req, res));
  router.put('/:id', (req, res) => recipeController.update(req, res));
  router.delete('/:id', (req, res) => recipeController.delete(req, res));
  router.get('/search/name', (req, res) =>
    recipeController.searchByName(req, res)
  );
  router.get('/search/ingredient', (req, res) =>
    recipeController.searchByIngredient(req, res)
  );

  return router;
};
