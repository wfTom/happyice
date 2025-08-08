import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navigation.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="logo">
        <NavLink to="/">🍳 CookBook - HappyIce</NavLink>
      </div>

      <nav>
        <ul className="nav-desktop">
          <li>
            <NavLink to="/">Início</NavLink>
          </li>
          <li>
            <NavLink to="/recipes/new">Nova Receita</NavLink>
          </li>
          <li>
            <NavLink to="/favorites">Favoritos</NavLink>
          </li>
          {user ? (
            <li>
              <button onClick={logout}>Sair</button>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register">Cadastar</NavLink>
              </li>
            </>
          )}
        </ul>
        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        {menuOpen && (
          <ul className="mobile-menu">
            <li>
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/recipes/new" onClick={() => setMenuOpen(false)}>
                Nova Receita
              </NavLink>
            </li>
            <li>
              <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>
                Favoritos
              </NavLink>
            </li>
            {user ? (
              <li>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Sair
                </button>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                    Registrar
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
