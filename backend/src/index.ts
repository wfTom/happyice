import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { Database } from './infrastructure/database/Database';
import { RecipeRepository } from './infrastructure/repositories/RecipeRepository';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { IngredientRepository } from './infrastructure/repositories/IngredientRepository';
import { FavoriteRepository } from './infrastructure/repositories/FavoriteRepository';
import { createRecipeRoutes } from './interface/routes/RecipeRoutes';
import { createUserRoutes } from './interface/routes/UserRoutes';
import { createFavoriteRoutes } from './interface/routes/FavoriteRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

const database = new Database();

// Repositories
const recipeRepository = new RecipeRepository(database);
const userRepository = new UserRepository(database);
const ingredientRepository = new IngredientRepository(database);
const favoriteRepository = new FavoriteRepository(database);

// Routes
const recipeRoutes = createRecipeRoutes(recipeRepository, ingredientRepository);
const userRoutes = createUserRoutes(userRepository);
const favoriteRoutes = createFavoriteRoutes(
  favoriteRepository,
  userRepository,
  recipeRepository
);

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
