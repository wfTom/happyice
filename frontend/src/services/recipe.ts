import api from './api';

interface RecipeIngredient {
  ingredientId?: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  id?: string;
  name: string;
  description: string;
  steps: string[];
  ingredients: RecipeIngredient[];
}

export const createRecipe = async (recipe: Recipe) => {
  const response = await api.post('/recipes', recipe);
  return response.data;
};

export const getRecipe = async (id: string) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const updateRecipe = async (id: string, recipe: Recipe) => {
  const response = await api.put(`/recipes/${id}`, recipe);
  return response.data;
};

export const deleteRecipe = async (id: string) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};

export const searchRecipesByName = async (name: string) => {
  const response = await api.get(`/recipes/search/name?name=${name}`);
  return response.data;
};

export const searchRecipesByIngredient = async (ingredient: string) => {
  const response = await api.get(
    `/recipes/search/ingredient?ingredient=${ingredient}`
  );
  return response.data;
};

export const getAllRecipes = async () => {
  const response = await api.get('/recipes');
  return response.data;
};
