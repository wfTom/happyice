import React, { useEffect, useState } from 'react';
import { listFavoriteRecipes } from '../services/favorite';
import type { Recipe } from '../types/Recipe';
import RecipeDisplayCard from '../components/RecipeDisplayCard';
import { useAuth } from '../context/AuthContext';
import RecipeHeader from '../components/RecipeHeader';

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
        const recipes = await listFavoriteRecipes();
        setFavoriteRecipes(recipes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteRecipes();
  }, [user]);

  if (loading) {
    return <div className="loading">Carregando receitas favoritas...</div>;
  }

  if (!user) {
    return (
      <div className="error-message">
        Opa! Parece que você não está logado.
        <br />
        Faça login para acessar suas receitas favoritas.
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Erro: {error}</div>;
  }

  return (
    <div>
      <RecipeHeader title="Receitas Favoritas" />
      {favoriteRecipes.length === 0 ? (
        <p className="empty-message">Nenhuma receita favorita encontrada.</p>
      ) : (
        <ul className="favorite-recipes">
          {favoriteRecipes.map((recipe) => (
            <li key={recipe.id} className="favorite-recipe-item">
              <h3>{recipe.name}</h3>
              <RecipeDisplayCard recipe={recipe} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteRecipes;
