import React from 'react';

interface RecipeHeaderProps {
  title: string;
  subtitle?: string;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
};

export default RecipeHeader;
