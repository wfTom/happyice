import React, { useEffect, useState } from 'react';
import '../styles/search.css';
import {
  getAllRecipes,
  searchRecipesByName,
  searchRecipesByIngredient,
} from '../services/recipe';
import type { Recipe } from '../types/Recipe';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<'nome' | 'ingrediente'>('nome');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await getAllRecipes();
        setRecipes(data);
        console.log('Receitas buscadas:', data);
      } catch (err: any) {
        setError(err.message);
        console.error('Erro ao buscar receitas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      let data: Recipe[] = [];
      if (searchType === 'nome') {
        data = await searchRecipesByName(searchTerm);
      } else {
        data = await searchRecipesByIngredient(searchTerm);
      }
      setRecipes(data);
      console.log('Receitas pesquisadas:', data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando receitas...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div>
      <h2>Receitas</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar receitas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(e.target.value as 'nome' | 'ingrediente')
          }
        >
          <option value="nome">Por Nome</option>
          <option value="ingrediente">Por Ingrediente</option>
        </select>
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {recipes.length === 0 ? (
        <p>Nenhuma receita encontrada.</p>
      ) : (
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeList;
