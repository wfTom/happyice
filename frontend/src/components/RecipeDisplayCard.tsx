import React from 'react';
import type { Recipe } from '../types/Recipe';
import placeholderImage from '../assets/placeholder.svg';

interface RecipeDisplayCardProps {
  recipe: Recipe;
}

const RecipeDisplayCard: React.FC<RecipeDisplayCardProps> = ({ recipe }) => {
  return (
    <>
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
    </>
  );
};

export default RecipeDisplayCard;
