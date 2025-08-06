import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/recipes';

interface RecipeIngredient {
  ingredientId: string;
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
  const response = await axios.post(API_URL, recipe);
  return response.data;
};

export const getRecipe = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateRecipe = async (id: string, recipe: Recipe) => {
  const response = await axios.put(`${API_URL}/${id}`, recipe);
  return response.data;
};

export const deleteRecipe = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const searchRecipesByName = async (name: string) => {
  const response = await axios.get(`${API_URL}/search/name?q=${name}`);
  return response.data;
};

export const searchRecipesByIngredient = async (ingredient: string) => {
  const response = await axios.get(`${API_URL}/search/ingredient?q=${ingredient}`);
  return response.data;
};

export const getAllRecipes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
