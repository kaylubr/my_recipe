import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetSeafoodMealsQuery, useGetChickenMealsQuery, useSearchMealsQuery } from '../features/recipeApi'
import { setSearchQuery, setCurrentPage, toggleFavorite } from '../features/recipeSlice'

const FOOD_DESCRIPTIONS = [
  'Fresh seafood and delicious chicken dishes await you',
  'Explore Italian pasta and traditional flavors',
  'Discover Asian fusion and exotic tastes',
  'Indulge in comfort food classics',
  'Savor Mediterranean cuisine at its finest',
  'Experience spicy and bold flavors',
  'Enjoy light and healthy options',
  'Taste international delights from around the world',
]

const HomePage = () => {
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFoodIndex((prev) => (prev + 1) % FOOD_DESCRIPTIONS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const dispatch = useDispatch()
  const { searchQuery, currentPage, itemsPerPage, favorites } = useSelector((s) => s.recipes)

  const isSearching = searchQuery.trim().length > 0

  const { data: seafoodMeals = [], isLoading: seafoodLoading, isError: seafoodError } = useGetSeafoodMealsQuery()
  const { data: chickenMeals = [], isLoading: chickenLoading, isError: chickenError } = useGetChickenMealsQuery()

  const { data: searchResults = [], isLoading: searchLoading, isError: searchError } = useSearchMealsQuery(
    searchQuery.trim(),
    { skip: !isSearching }
  )

  const allMeals = useMemo(() => {
    return [...seafoodMeals, ...chickenMeals].sort((a, b) => a.strMeal.localeCompare(b.strMeal))
  }, [seafoodMeals, chickenMeals])

  const meals = isSearching ? searchResults : allMeals
  const isLoading = isSearching ? searchLoading : (seafoodLoading || chickenLoading)
  const isError = isSearching ? searchError : (seafoodError || chickenError)

  const totalPages = Math.ceil(meals.length / itemsPerPage)
  const paginated = meals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const renderRecipeCard = (meal) => {
    const isFav = favorites.includes(meal.idMeal)
    return (
      <div key={meal.idMeal} className="recipe-card">
        <div className="recipe-card-image-wrapper">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-card-image" />
          <button
            onClick={() => dispatch(toggleFavorite(meal.idMeal))}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className={`favorite-button ${isFav ? 'favorite-button--active' : ''}`}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="recipe-card-body">
          <h3 className="recipe-card-title">{meal.strMeal}</h3>
          <Link to={`/recipe/${meal.idMeal}`} className="view-recipe-button">
            View Recipe
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Banner */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-tag">Explore Culinary Delights</div>
          <h1 className="hero-title">Discover Recipes</h1>
          <p className="hero-subtitle food-cycle-text" key={currentFoodIndex}>
            {FOOD_DESCRIPTIONS[currentFoodIndex]}
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Search Bar */}
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search any recipe..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="search-input"
          />
        </div>

        {isLoading && <p className="status-message">Loading delicious recipes...</p>}
        {isError && <p className="status-message status-message--error">Failed to load recipes.</p>}
        {!isLoading && !isError && meals.length === 0 && (
          <p className="status-message">No recipes found for &ldquo;{searchQuery}&rdquo;</p>
        )}

        {/* Categories when not searching */}
        {!isSearching && !isLoading && !isError && (
          <>
            {seafoodMeals.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <h2 className="section-title">Seafood Specialties</h2>
                  <p className="section-subtitle">Dive into our fresh and delicious seafood collection</p>
                </div>
                <div className="recipe-grid">
                  {seafoodMeals.slice(0, 8).map(renderRecipeCard)}
                </div>
              </div>
            )}

            {chickenMeals.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <h2 className="section-title">Chicken Recipes</h2>
                  <p className="section-subtitle">Explore our favorite chicken recipes</p>
                </div>
                <div className="recipe-grid">
                  {chickenMeals.slice(0, 8).map(renderRecipeCard)}
                </div>
              </div>
            )}
          </>
        )}

        {/* Search Results with Pagination */}
        {isSearching && !isLoading && !isError && meals.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">Search Results</h2>
              <p className="section-subtitle">Found {meals.length} recipe{meals.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="recipe-grid">
              {paginated.map(renderRecipeCard)}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                  disabled={currentPage === 1}
                  className="page-button"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => dispatch(setCurrentPage(page))}
                    className={`page-button ${currentPage === page ? 'page-button--active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="page-button"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage