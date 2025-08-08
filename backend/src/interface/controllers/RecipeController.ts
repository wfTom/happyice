import { Request, Response } from 'express';
import { CreateRecipe } from '../../application/use-cases/recipe/CreateRecipe';
import { GetRecipe } from '../../application/use-cases/recipe/GetRecipe';
import { UpdateRecipe } from '../../application/use-cases/recipe/UpdateRecipe';
import { DeleteRecipe } from '../../application/use-cases/recipe/DeleteRecipe';
import { SearchRecipesByName } from '../../application/use-cases/recipe/SearchRecipesByName';
import { SearchRecipesByIngredient } from '../../application/use-cases/recipe/SearchRecipesByIngredient';
import { ListAllRecipes } from '../../application/use-cases/recipe/ListAllRecipes';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class RecipeController {
  constructor(
    private readonly createRecipe: CreateRecipe,
    private readonly getRecipe: GetRecipe,
    private readonly updateRecipe: UpdateRecipe,
    private readonly deleteRecipe: DeleteRecipe,
    private readonly searchRecipesByName: SearchRecipesByName,
    private readonly searchRecipesByIngredient: SearchRecipesByIngredient,
    private readonly listAllRecipes: ListAllRecipes
  ) {}

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, description, steps, ingredients } = req.body;
      const userId = req.user!.id;
      await this.createRecipe.execute(
        userId,
        name,
        description,
        steps,
        ingredients
      );
      res.status(201).send({ message: 'Receita criada com sucesso' });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const recipe = await this.getRecipe.execute(id);
      if (recipe) {
        res.json(recipe);
      } else {
        res.status(404).send({ message: 'Receita não encontrada' });
      }
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, steps, ingredients } = req.body;
      await this.updateRecipe.execute(
        id,
        name,
        description,
        steps,
        ingredients
      );
      res.status(200).send({ message: 'Receita atualizada com sucesso' });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteRecipe.execute(id);
      res.status(200).send({ message: 'Receita deletada com sucesso' });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }

  async searchByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      if (!name) {
        res.status(400).json({ error: 'O nome da receita é obrigatório' });
        return;
      }
      const recipes = await this.searchRecipesByName.execute(name as string);
      res.json(recipes);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(error);
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchByIngredient(req: Request, res: Response): Promise<void> {
    try {
      const { ingredient } = req.query;
      if (!ingredient) {
        res.status(400).json({ error: 'O nome do ingrediente é obrigatório' });
        return;
      }
      const recipes = await this.searchRecipesByIngredient.execute(
        ingredient as string
      );
      res.json(recipes);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(error);
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const recipes = await this.listAllRecipes.execute();
      res.json(recipes);
    } catch (error: any) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(error);
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
