import api from './api';

export const favoriteRecipe = async (recipeId: string) => {
  const response = await api.post('/favorites', { recipeId });
  return response.data;
};

export const unfavoriteRecipe = async (recipeId: string) => {
  const response = await api.delete(`/favorites/${recipeId}`);
  return response.data;
};

export const listFavoriteRecipes = async () => {
  const response = await api.get('/favorites');
  return response.data;
};
