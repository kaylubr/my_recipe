import { useParams, Link } from 'react-router-dom'
import { useGetMealByIdQuery } from '../features/recipeApi'

const RecipeDetailPage = () => {
  const { id } = useParams()
  const { data: meal, isLoading, isError } = useGetMealByIdQuery(id)

  if (isLoading) return <p style={{ textAlign: 'center', padding: '48px' }}>Loading recipe...</p>
  if (isError || !meal) return <p style={{ textAlign: 'center', padding: '48px', color: 'red' }}>Recipe not found.</p>

  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure?.trim()} ${ingredient.trim()}`)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>

      <Link to="/" style={{ textDecoration: 'none', color: '#1b4f6b' }}>Back</Link>

      <h1 style={{ fontSize: '2rem', margin: '16px 0' }}>{meal.strMeal}</h1>

      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        style={{ width: '100%', borderRadius: '12px', marginBottom: '24px' }}
      />

      <h2 style={{ marginBottom: '12px' }}>Ingredients</h2>
      <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
        {ingredients.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
        ))}
      </ul>

      <h2 style={{ marginBottom: '12px' }}>Instructions</h2>
      <p style={{ lineHeight: '1.8', color: '#333' }}>{meal.strInstructions}</p>

    </div>
  )
}

export default RecipeDetailPage