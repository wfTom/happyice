import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/recipe-detail.css';
import { getRecipe } from '../services/recipe';
import {
  favoriteRecipe,
  unfavoriteRecipe,
  listFavoriteRecipes,
} from '../services/favorite';
import placeholderImage from '../assets/placeholder.svg';
import heart from '../assets/heart.svg';
import heartFill from '../assets/heart-fill.svg';
import type { Recipe } from '../types/Recipe';
import { useAuth } from '../context/AuthContext';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipeAndFavoriteStatus = async () => {
      if (!id) return;
      try {
        const recipeResponse = await getRecipe(id);
        setRecipe(recipeResponse);

        if (user) {
          const favoriteRecipesResponse = await listFavoriteRecipes(user.id);
          const favorite = favoriteRecipesResponse.some(
            (favRecipe: Recipe) => favRecipe.id === recipeResponse.id
          );
          setIsFavorite(favorite);
        }
      } catch (err: any) {
        setError(err.message);
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
        await unfavoriteRecipe(recipe.id!);
      } else {
        await favoriteRecipe(recipe.id!);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <div className="loading">Carregando detalhes da receita...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!recipe) return <div>Receita não encontrada.</div>;

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <h2>{recipe.name}</h2>
        <button
          onClick={handleFavoriteToggle}
          className="favorite-button"
          disabled={!user}
          aria-label={
            isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
          }
        >
          <img
            src={isFavorite ? heartFill : heart}
            alt="Favoritar"
            width="28"
            height="28"
          />
        </button>
      </div>

      {!user && (
        <p className="login-hint">Faça login para favoritar receitas.</p>
      )}
      <p className="description">
        <strong>Descrição:</strong> {recipe.description}
      </p>

      <img
        className="thumb"
        src={placeholderImage}
        alt={recipe.name}
        loading="lazy"
      />

      <div className="recipe-content">
        <div>
          <h3>Passos</h3>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <h3>Ingredientes</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.unit} de {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
