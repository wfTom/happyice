import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/recipe-form.css';
import { getRecipe, createRecipe, updateRecipe } from '../services/recipe';
import type { RecipeIngredient } from '../types/RecipeIngredient';

import RecipeHeader from '../components/RecipeHeader';
import RecipeField from '../components/RecipeField';
import IngredientRow from '../components/IngredientRow';

const RecipeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<string>('');
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getRecipe(id)
        .then((recipe) => {
          setName(recipe.name);
          setDescription(recipe.description);
          setSteps(recipe.steps.join('\n'));
          setIngredients(recipe.ingredients);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleIngredientChange = (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { ingredientId: '', name: '', quantity: 0, unit: '' },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    for (const ingredient of ingredients) {
      const quantity = parseFloat(String(ingredient.quantity));
      if (isNaN(quantity) || quantity <= 0) {
        setError('A quantidade de um ingrediente deve ser maior que 0.');
        setLoading(false);
        return;
      }
    }
    const recipeData = {
      name,
      description,
      steps: steps.split('\n').filter((step) => step.trim() !== ''),
      ingredients,
    };
    try {
      if (id) {
        await updateRecipe(id, recipeData);
      } else {
        await createRecipe(recipeData);
      }
      navigate('/recipes');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div className="loading">Carregando receita para edição...</div>;
  }

  return (
    <div className="recipe-form-container">
      <RecipeHeader
        title={id ? 'Editar Receita' : 'Criar Receita'}
        subtitle={
          id
            ? 'Atualize as informações da sua receita.'
            : 'Preencha os campos abaixo para adicionar uma nova receita deliciosa.'
        }
      />

      <form onSubmit={handleSubmit} className="recipe-form">
        <RecipeField label="Nome:" value={name} onChange={setName} required />
        <RecipeField
          label="Descrição:"
          value={description}
          onChange={setDescription}
          textarea
          required
        />
        <RecipeField
          label="Passos (um por linha):"
          value={steps}
          onChange={setSteps}
          textarea
          required
        />

        <div className="ingredient-section">
          <h3>Ingredientes</h3>
          {ingredients.map((ingredient, index) => (
            <IngredientRow
              key={index}
              ingredient={ingredient}
              index={index}
              onChange={handleIngredientChange}
              onRemove={removeIngredient}
            />
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className="add-ingredient-button"
          >
            Adicionar Ingrediente
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {id ? 'Atualizar Receita' : 'Criar Receita'}
          </button>
        </div>

        {error && <p className="error">Erro: {error}</p>}
      </form>
    </div>
  );
};

export default RecipeForm;
