import React, { useEffect, useState } from 'react';
import '../styles/search.css';
import {
  getAllRecipes,
  searchRecipesByName,
  searchRecipesByIngredient,
} from '../services/recipe';
import type { Recipe } from '../types/Recipe';
import { Link } from 'react-router-dom';
import placeholderImage from '../assets/placeholder.svg';

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data =
        searchType === 'nome'
          ? await searchRecipesByName(searchTerm)
          : await searchRecipesByIngredient(searchTerm);
      setRecipes(data);
    } catch (err: any) {
      setError('Erro ao buscar receitas.');
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
    <section className="container">
      <h2 className="page-title">Descubra Receitas</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Ex: bolo de cenoura"
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
              <Link
                to={`/recipes/${recipe.id}`}
                className="recipe-link"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <img
                  className="thumb"
                  src={placeholderImage}
                  alt={recipe.name}
                  loading="lazy"
                />
                <div className="card-body">
                  <h3>{recipe.name}</h3>
                  <p>{recipe.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RecipeList;
