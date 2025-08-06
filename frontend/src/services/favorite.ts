import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/favorites';

export const favoriteRecipe = async (userId: string, recipeId: string) => {
  const response = await axios.post(API_URL, { userId, recipeId });
  return response.data;
};

export const unfavoriteRecipe = async (userId: string, recipeId: string) => {
  const response = await axios.delete(`${API_URL}/${userId}/${recipeId}`);
  return response.data;
};

export const listFavoriteRecipes = async (userId: string) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};
