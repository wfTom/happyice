import React from 'react';
import RecipeList from './RecipeList';
import '../styles/home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Descubra e compartilhe receitas incríveis</h1>
        <p>Explore pratos deliciosos criados por nossa comunidade.</p>
        <button>
          <a href="/recipes/new" className="btn-primary">
            Compartilhar Receita
          </a>
        </button>
      </section>

      <section className="recipe-section">
        <h2>Últimas Receitas</h2>
        <RecipeList />
      </section>
    </div>
  );
};

export default Home;
