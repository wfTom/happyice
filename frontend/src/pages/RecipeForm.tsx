import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/recipe-form.css';
import { getRecipe, createRecipe, updateRecipe } from '../services/recipe';
import type { RecipeIngredient } from '../types/RecipeIngredient';

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
        .then((response) => {
          const recipe = response;
          setName(recipe.name);
          setDescription(recipe.description);
          setSteps(recipe.steps.join('\n'));
          setIngredients(recipe.ingredients);
          console.log('Receita buscada para edição:', recipe);
        })
        .catch((err) => {
          setError(err.message);
          console.error('Erro ao buscar receita:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleIngredientChange = (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { ingredientId: '', name: '', quantity: 0, unit: '' },
    ]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const recipeData = {
      name,
      description,
      steps: steps.split('\n').filter((step) => step.trim() !== ''),
      ingredients,
    };

    try {
      if (id) {
        await updateRecipe(id, recipeData);
        console.log('Receita atualizada:', recipeData);
      } else {
        await createRecipe(recipeData);
        console.log('Receita criada:', recipeData);
      }
      navigate('/recipes');
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao salvar receita:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div className="loading">Carregando receita para edição...</div>;
  }

  return (
    <div className="recipe-form">
      <h2>{id ? 'Editar Receita' : 'Criar Receita'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="steps">Passos (um por linha):</label>
          <textarea
            id="steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            required
          />
        </div>
        <h3>Ingredientes</h3>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-inputs">
            <input
              type="text"
              placeholder="ID do Ingrediente"
              value={ingredient.ingredientId}
              onChange={(e) =>
                handleIngredientChange(index, 'ingredientId', e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Nome do Ingrediente"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, 'name', e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(
                  index,
                  'quantity',
                  parseFloat(e.target.value)
                )
              }
              required
            />
            <input
              type="text"
              placeholder="Unidade"
              value={ingredient.unit}
              onChange={(e) =>
                handleIngredientChange(index, 'unit', e.target.value)
              }
              required
            />
            <button type="button" onClick={() => removeIngredient(index)} className="remove-ingredient-button">
              Remover
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="add-ingredient-button">
          Adicionar Ingrediente
        </button>
        <button type="submit" disabled={loading} className="submit-button">
          {id ? 'Atualizar Receita' : 'Criar Receita'}
        </button>
        {error && <p className="error">Erro: {error}</p>}
      </form>
    </div>
  );
};

export default RecipeForm;
