import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetSeafoodMealsQuery, useGetChickenMealsQuery } from '../features/recipeApi'
import { toggleFavorite } from '../features/recipeSlice'

const FavoritesPage = () => {
  const dispatch = useDispatch()
  const { favorites } = useSelector((s) => s.recipes)

  const { data: seafoodMeals = [], isLoading: seafoodLoading, isError: seafoodError } = useGetSeafoodMealsQuery()
  const { data: chickenMeals = [], isLoading: chickenLoading, isError: chickenError } = useGetChickenMealsQuery()

  const isLoading = seafoodLoading || chickenLoading
  const isError = seafoodError || chickenError

  const allMeals = useMemo(() => [...seafoodMeals, ...chickenMeals], [seafoodMeals, chickenMeals])
  const favoritedMeals = useMemo(() => allMeals.filter((meal) => favorites.includes(meal.idMeal)), [allMeals, favorites])

  return (
    <div className="page-container">
      <div className="favorites-header">
        <h1 className="favorites-title">Your Favorites</h1>
        <p className="favorites-subtitle">
          {favoritedMeals.length === 0
            ? 'No favorites yet — heart a recipe to save it here.'
            : `${favoritedMeals.length} saved recipe${favoritedMeals.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {isLoading && <p className="status-message">Loading...</p>}
      {isError && <p className="status-message status-message--error">Failed to load recipes. Please try again later.</p>}

      {!isLoading && !isError && favoritedMeals.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-text">You haven't saved any recipes yet.</p>
          <Link to="/" className="browse-button">Browse Recipes</Link>
        </div>
      )}

      {favoritedMeals.length > 0 && (
        <div className="recipe-grid">
          {favoritedMeals.map((meal) => (
            <div key={meal.idMeal} className="recipe-card">
              <div className="recipe-card-image-wrapper">
                <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-card-image" />
                <button
                  onClick={() => dispatch(toggleFavorite(meal.idMeal))}
                  title="Remove from favorites"
                  className="favorite-button favorite-button--active"
                >
                  ❤️
                </button>
              </div>
              <div className="recipe-card-body">
                <h3 className="recipe-card-title">{meal.strMeal}</h3>
                <Link to={`/recipe/${meal.idMeal}`} className="view-recipe-button">
                  View Recipe
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage