import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const { favorites } = useSelector((s) => s.recipes)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">🍳 RecipeHub</span>

        <div className="navbar-tabs">
          <NavLink to="/" end className="nav-link">
            Recipes
          </NavLink>
          <NavLink to="/favorites" className="nav-link">
            Favorites{favorites.length ? ` (${favorites.length})` : ''}
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar