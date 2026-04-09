import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useGetMealByIdQuery } from '../features/recipeApi'
import { toggleFavorite } from '../features/recipeSlice'

const RecipeDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { favorites } = useSelector((s) => s.recipes)
  const { data: meal, isLoading, isError } = useGetMealByIdQuery(id)

  if (isLoading) return <p className="detail-loading">Loading recipe...</p>
  if (isError || !meal) return <p className="detail-error">Recipe not found.</p>

  const isFav = favorites.includes(meal.idMeal)

  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push([measure?.trim(), ingredient.trim()].filter(Boolean).join(' '))
    }
  }

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Back to Recipes</Link>

      <div className="detail-header">
        <h1 className="detail-title">{meal.strMeal}</h1>
        <button
          onClick={() => dispatch(toggleFavorite(meal.idMeal))}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="detail-fav-button"
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="detail-tags">
        {meal.strCategory && <span className="detail-tag detail-tag--primary">{meal.strCategory}</span>}
        {meal.strArea && <span className="detail-tag detail-tag--secondary">{meal.strArea}</span>}
      </div>

      <img src={meal.strMealThumb} alt={meal.strMeal} className="detail-image" />

      <div className="detail-section">
        <h2 className="detail-section-title">Ingredients</h2>
        <ul className="ingredients-list">
          {ingredients.map((item, idx) => (
            <li key={idx} className="ingredient-item">✓ {item}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h2 className="detail-section-title">Instructions</h2>
        <div className="instructions-text">
          {meal.strInstructions.split('\n').filter(Boolean).map((para, i) => (
            <p key={i} className="instruction-paragraph">{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage