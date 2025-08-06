import React, { useEffect, useState } from 'react';
import { listFavoriteRecipes } from '../services/favorite';
import type { Recipe } from '../types/Recipe';
import { useAuth } from '../context/AuthContext';

const FavoriteRecipes: React.FC = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      if (!user) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }
      try {
        const recipes = await listFavoriteRecipes(user.id);
        setFavoriteRecipes(recipes);
        console.log('Receitas favoritas buscadas:', recipes);
      } catch (err: any) {
        setError(err.message);
        console.error('Erro ao buscar receitas favoritas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, [user]);

  if (loading) {
    return <div className="loading">Carregando receitas favoritas...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  if (!user) {
    return <div className="error">Por favor, faça login para ver suas receitas favoritas.</div>;
  }

  return (
    <div>
      <h2>Receitas Favoritas</h2>
      {favoriteRecipes.length === 0 ? (
        <p>Nenhuma receita favorita encontrada.</p>
      ) : (
        <ul className="favorite-recipes">
          {favoriteRecipes.map((recipe) => (
            <li key={recipe.id} className="favorite-recipe-item">
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
              <h4>Passos:</h4>
              <ol>
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <h4>Ingredientes:</h4>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient.quantity} {ingredient.unit} de {ingredient.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteRecipes;
