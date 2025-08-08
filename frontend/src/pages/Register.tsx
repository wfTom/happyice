import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth-form.css';
import '../styles/global.css';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar usuário');
    }
  };

  return (
    <div className="login-page-background">
      <div className="login-card">
        <h2 className="login-title">Criar Conta</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Nome de Usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
      </div>
    </div>
  );
};

export default Register;
