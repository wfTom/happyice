import React from 'react';

interface RecipeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  required?: boolean;
}

const RecipeField: React.FC<RecipeFieldProps> = ({
  label,
  value,
  onChange,
  textarea = false,
  required = false,
}) => {
  return (
    <div className="form-section">
      <label className="form-label">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
    </div>
  );
};

export default RecipeField;
