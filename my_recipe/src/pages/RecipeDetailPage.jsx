import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useGetMealByIdQuery } from '../features/recipeApi'
import { toggleFavorite } from '../features/recipeSlice'

const injectFonts = () => {
  if (document.getElementById('recipe-fonts')) return
  const link = document.createElement('link')
  link.id = 'recipe-fonts'
  link.rel = 'stylesheet'
  link.href =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap'
  document.head.appendChild(link)
}

const RecipeDetailPage = () => {
  useEffect(() => { injectFonts() }, [])

  const { id } = useParams()
  const dispatch = useDispatch()
  const { favorites } = useSelector((s) => s.recipes)
  const { data: meal, isLoading, isError } = useGetMealByIdQuery(id)

  if (isLoading)
    return (
      <p style={{ textAlign: 'center', padding: '48px', fontFamily: "'DM Sans', sans-serif", color: '#888' }}>
        Loading recipe...
      </p>
    )
  if (isError || !meal)
    return (
      <p style={{ textAlign: 'center', padding: '48px', color: 'red', fontFamily: "'DM Sans', sans-serif" }}>
        Recipe not found.
      </p>
    )

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
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 24px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Back link */}
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: '#1b4f6b',
          fontSize: '0.9rem',
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        ← Back to Recipes
      </Link>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', margin: '20px 0 4px' }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#111',
            margin: 0,
            flex: 1,
            lineHeight: 1.2,
          }}
        >
          {meal.strMeal}
        </h1>

        {/* Favorite button on detail page too */}
        <button
          onClick={() => dispatch(toggleFavorite(meal.idMeal))}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            flexShrink: 0,
            background: 'white',
            border: '1.5px solid #ddd',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '1.3rem',
            cursor: 'pointer',
            color: isFav ? '#e03e3e' : '#bbb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s, color 0.15s',
            marginTop: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {meal.strCategory && (
          <span style={{
            padding: '4px 12px',
            borderRadius: '999px',
            background: '#eef4f8',
            color: '#1b4f6b',
            fontSize: '0.8rem',
            fontWeight: 500,
          }}>
            {meal.strCategory}
          </span>
        )}
        {meal.strArea && (
          <span style={{
            padding: '4px 12px',
            borderRadius: '999px',
            background: '#f0f0f0',
            color: '#555',
            fontSize: '0.8rem',
            fontWeight: 500,
          }}>
            {meal.strArea}
          </span>
        )}
      </div>

      {/* Image */}
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        style={{
          width: '100%',
          borderRadius: '14px',
          marginBottom: '32px',
          display: 'block',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      />

      {/* Ingredients */}
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.6rem',
          fontWeight: 600,
          color: '#111',
          marginBottom: '16px',
        }}
      >
        Ingredients
      </h2>
      <ul
        style={{
          marginBottom: '32px',
          paddingLeft: '0',
          listStyle: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '8px',
        }}
      >
        {ingredients.map((item, idx) => (
          <li
            key={idx}
            style={{
              padding: '8px 12px',
              background: '#f7f9fb',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#333',
              borderLeft: '3px solid #1b4f6b',
            }}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* Instructions */}
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.6rem',
          fontWeight: 600,
          color: '#111',
          marginBottom: '16px',
        }}
      >
        Instructions
      </h2>
      <div style={{ lineHeight: '1.85', color: '#333', fontSize: '0.95rem' }}>
        {meal.strInstructions.split('\n').filter(Boolean).map((para, i) => (
          <p key={i} style={{ marginBottom: '14px' }}>{para}</p>
        ))}
      </div>
    </div>
  )
}

export default RecipeDetailPage