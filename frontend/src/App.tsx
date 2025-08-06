import { Routes, Route, NavLink } from 'react-router-dom';
import './styles/navigation.css';
import Register from './pages/Register';
import Login from './pages/Login';
import RecipeList from './pages/RecipeList';
import RecipeForm from './pages/RecipeForm';
import FavoriteRecipes from './pages/FavoriteRecipes';
import RecipeDetail from './pages/RecipeDetail';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/recipes/new">New Recipe</NavLink></li>
          <li><NavLink to="/favorites">Favorites</NavLink></li>
          {user ? (
            <li><button onClick={logout}>Logout</button></li>
          ) : (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/register">Register</NavLink></li>
            </>
          )}
        </ul>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/recipes/edit/:id" element={<RecipeForm />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<FavoriteRecipes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
