import React from 'react';
import { Link } from 'react-router-dom';
import RecipeList from './RecipeList';
import '../styles/home.css';
import RecipeHeader from '../components/RecipeHeader';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Descubra e compartilhe receitas incríveis</h1>
        <p>Explore pratos deliciosos criados por nossa comunidade.</p>
        <Link to="/recipes/new" className="btn-primary">
          Compartilhar Receita
        </Link>
      </section>

      <section className="recipe-section">
        <RecipeHeader title="Últimas Receitas" />
        <RecipeList />
      </section>
    </div>
  );
};

export default Home;
