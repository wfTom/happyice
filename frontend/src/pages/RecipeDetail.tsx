import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/recipe-detail.css';
import { getRecipe } from '../services/recipe';
import {
  favoriteRecipe,
  unfavoriteRecipe,
  listFavoriteRecipes,
} from '../services/favorite';
import type { Recipe } from '../types/Recipe';
import { useAuth } from '../context/AuthContext';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipeAndFavoriteStatus = async () => {
      if (!id) return;
      try {
        const recipeResponse = await getRecipe(id);
        setRecipe(recipeResponse);
        console.log('Detalhes da receita buscados:', recipeResponse);

        if (user) {
          const favoriteRecipesResponse = await listFavoriteRecipes(user.id);
          const favorite = favoriteRecipesResponse.some(
            (favRecipe: Recipe) => favRecipe.id === recipeResponse.id
          );
          setIsFavorite(favorite);
        }
      } catch (err: any) {
        setError(err.message);
        console.error(
          'Erro ao buscar detalhes da receita ou status de favorito:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeAndFavoriteStatus();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user || !recipe) return;
    try {
      if (isFavorite) {
        await unfavoriteRecipe(user.id, recipe.id!);
        console.log('Receita desfavoritada');
      } else {
        await favoriteRecipe(user.id, recipe.id!);
        console.log('Receita favoritada');
      }
      setIsFavorite(!isFavorite);
    } catch (err: any) {
      console.error('Erro ao alternar favorito:', err);
    }
  };

  if (loading) {
    return <div className="loading">Carregando detalhes da receita...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  if (!recipe) {
    return <div>Receita não encontrada.</div>;
  }

  return (
    <div className="recipe-detail">
      <h2>{recipe.name}</h2>
      <button onClick={handleFavoriteToggle} className="favorite-button" disabled={!user}>
        {isFavorite ? 'Desfavoritar' : 'Favoritar'}
      </button>
      {!user && <p>Faça login para favoritar receitas.</p>}
      <p>
        <strong>Descrição:</strong> {recipe.description}
      </p>
      <h3>Passos:</h3>
      <ol>
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      <h3>Ingredientes:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} {ingredient.unit} de {ingredient.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetail;
