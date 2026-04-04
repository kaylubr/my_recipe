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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', fontFamily: "'DM Sans', sans-serif" }}>

      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 700, color: '#111', margin: '0 0 6px 0' }}>
          Your Favorites
        </h1>
        <p style={{ color: '#888', fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>
          {favoritedMeals.length === 0
            ? 'No favorites yet — heart a recipe to save it here.'
            : `${favoritedMeals.length} saved recipe${favoritedMeals.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {isLoading && <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>}
      {isError && <p style={{ textAlign: 'center', color: 'red' }}>Failed to load recipes. Please try again later.</p>}

      {!isLoading && !isError && favoritedMeals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#f7f9fb', borderRadius: '16px', color: '#aaa' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>♡</div>
          <p style={{ fontSize: '1rem', margin: '0 0 20px' }}>You haven't saved any recipes yet.</p>
          <Link to="/" style={{ padding: '10px 22px', background: '#1b4f6b', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
            Browse Recipes
          </Link>
        </div>
      )}

      {favoritedMeals.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          {favoritedMeals.map((meal) => (
            <div
              key={meal.idMeal}
              style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', background: 'white', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.13)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={meal.strMealThumb} alt={meal.strMeal} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                <button
                  onClick={() => dispatch(toggleFavorite(meal.idMeal))}
                  title="Remove from favorites"
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.1rem', cursor: 'pointer', color: '#e03e3e', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  ♥
                </button>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 500, color: '#111', margin: '0 0 12px 0', flex: 1, lineHeight: 1.4 }}>
                  {meal.strMeal}
                </h3>
                <Link
                  to={`/recipe/${meal.idMeal}`}
                  style={{ display: 'inline-block', padding: '9px 18px', background: '#1b4f6b', color: 'white', borderRadius: '8px', fontSize: '0.85rem', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, alignSelf: 'flex-start', marginTop: 'auto' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#153d54')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#1b4f6b')}
                >
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