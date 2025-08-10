import React from 'react';
import type { RecipeIngredient } from '../types/RecipeIngredient';
import { UnitType } from '../types/UnitType';
import trashIcon from '../assets/trash.svg';

interface IngredientRowProps {
  ingredient: RecipeIngredient;
  index: number;
  onChange: (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
}

const IngredientRow: React.FC<IngredientRowProps> = ({
  ingredient,
  index,
  onChange,
  onRemove,
}) => {
  return (
    <div className="ingredient-row">
      <input
        type="text"
        placeholder="Nome do Ingrediente"
        value={ingredient.name}
        onChange={(e) => onChange(index, 'name', e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Qtd"
        value={ingredient.quantity}
        onChange={(e) =>
          onChange(index, 'quantity', parseFloat(e.target.value))
        }
        required
      />
      <select
        value={ingredient.unit}
        onChange={(e) => onChange(index, 'unit', e.target.value)}
        required
      >
        <option value="">Selecione...</option>
        {Object.values(UnitType).map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="remove-ingredient-icon"
      >
        <img src={trashIcon} alt="Remover" />
      </button>
    </div>
  );
};

export default IngredientRow;
