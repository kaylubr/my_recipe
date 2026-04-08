import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useGetMealByIdQuery } from '../features/recipeApi'
import { toggleFavorite } from '../features/recipeSlice'

const styles = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" },
  backLink: { textDecoration: 'none', color: '#d97334', fontSize: '0.95rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '32px', transition: 'color 0.2s' },
  headerWrap: { display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 700, color: '#1a1a1a', margin: 0, flex: 1, lineHeight: 1.1, letterSpacing: '-1px' },
  favBtn: { flexShrink: 0, background: 'white', border: '2px solid #e8dcd2', borderRadius: '50%', width: '50px', height: '50px', fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '8px' },
  tags: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' },
  tag: (color) => ({ padding: '6px 14px', borderRadius: '999px', background: color === 'primary' ? 'rgba(217, 115, 52, 0.1)' : '#f5f0eb', color: color === 'primary' ? '#d97334' : '#6b5d54', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }),
  img: { width: '100%', borderRadius: '16px', marginBottom: '48px', display: 'block', boxShadow: '0 8px 28px rgba(0,0,0,0.12)' },
  section: { marginBottom: '48px' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '20px', letterSpacing: '-0.5px' },
  ingredientsList: { marginBottom: '0', paddingLeft: '0', listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' },
  ingredientItem: { padding: '12px 16px', background: '#faf5f0', borderRadius: '10px', fontSize: '0.95rem', color: '#3a3a3a', borderLeft: '4px solid #d97334', transition: 'all 0.2s' },
  instructions: { lineHeight: '1.95', color: '#4a4a4a', fontSize: '1rem' },
  instructionPara: { marginBottom: '18px' },
}

const injectFonts = () => {
  if (document.getElementById('recipe-fonts')) return
  const link = document.createElement('link')
  link.id = 'recipe-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap'
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
      <p style={{ textAlign: 'center', padding: '48px', fontFamily: "'DM Sans', sans-serif", color: '#8b7d74', fontSize: '1.05rem' }}>
        Loading recipe...
      </p>
    )
  if (isError || !meal)
    return (
      <p style={{ textAlign: 'center', padding: '48px', color: '#c83e3e', fontFamily: "'DM Sans', sans-serif", fontSize: '1.05rem' }}>
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
    <div style={styles.page}>
      <Link
        to="/"
        style={styles.backLink}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#c85e24')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#d97334')}
      >
        ← Back to Recipes
      </Link>

      <div style={styles.headerWrap}>
        <h1 style={styles.title}>{meal.strMeal}</h1>
        <button
          onClick={() => dispatch(toggleFavorite(meal.idMeal))}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          style={{ ...styles.favBtn, fontSize: '1.3rem' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 115, 52, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={styles.tags}>
        {meal.strCategory && <span style={styles.tag('primary')}>{meal.strCategory}</span>}
        {meal.strArea && <span style={styles.tag('secondary')}>{meal.strArea}</span>}
      </div>

      <img src={meal.strMealThumb} alt={meal.strMeal} style={styles.img} />

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Ingredients</h2>
        <ul style={styles.ingredientsList}>
          {ingredients.map((item, idx) => (
            <li
              key={idx}
              style={styles.ingredientItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f0eb'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#faf5f0'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              ✓ {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Instructions</h2>
        <div style={styles.instructions}>
          {meal.strInstructions.split('\n').filter(Boolean).map((para, i) => (
            <p key={i} style={styles.instructionPara}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage