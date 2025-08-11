import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth-form.css';
import '../styles/global.css';
import { useAuth } from '../context/AuthContext';
import RecipeHeader from '../components/RecipeHeader';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="login-page-background">
      <div className="login-card">
        <RecipeHeader title="Bem-vindo de volta 🍲" />
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
          <button type="submit">Entrar</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="auth-link-text">
          Não tem uma conta ainda?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="auth-link-button"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
