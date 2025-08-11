import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth-form.css';
import '../styles/global.css';
import { useAuth } from '../context/AuthContext';
import RecipeHeader from '../components/RecipeHeader';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password);
      navigate('/login');
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || 'Erro ao registrar usuário');
    }
  };

  return (
    <div className="login-page-background">
      <div className="login-card">
        <RecipeHeader title="Bem-vindo ao CookBook 🍲" />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Registrar</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="auth-link-text">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="auth-link-button"
          >
            Faça Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
