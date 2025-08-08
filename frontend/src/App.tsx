import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import Register from './pages/Register';
import Login from './pages/Login';
import RecipeList from './pages/RecipeList';
import RecipeForm from './pages/RecipeForm';
import FavoriteRecipes from './pages/FavoriteRecipes';
import RecipeDetail from './pages/RecipeDetail';
import Home from './pages/Home';
import Header from './components/Header';

function App() {
  const location = useLocation();
  const fullScreenRoutes = ['/login', '/register'];
  const isFullScreen = fullScreenRoutes.includes(location.pathname);

  return (
    <div className={isFullScreen ? 'full-page' : ''}>
      {!isFullScreen && <Header />}
      <main className={isFullScreen ? 'full-page' : 'container'}>
        <Routes>
          <Route path="/" element={<Home />} />
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
