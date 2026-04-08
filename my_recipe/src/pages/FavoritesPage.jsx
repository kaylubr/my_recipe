import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetSeafoodMealsQuery, useGetChickenMealsQuery } from '../features/recipeApi'
import { toggleFavorite } from '../features/recipeSlice'

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', fontFamily: "'DM Sans', sans-serif" },
  header: { marginBottom: '50px' },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px 0', letterSpacing: '-0.5px' },
  subtitle: { color: '#8b7d74', fontSize: '1.05rem', margin: 0, fontWeight: 400 },
  emptyState: { textAlign: 'center', padding: '100px 24px', background: 'linear-gradient(135deg, #faf5f0 0%, #fff8f3 100%)', borderRadius: '16px', color: '#8b7d74', border: '1.5px dashed #e8dcd2' },
  emptyIcon: { fontSize: '3.5rem', marginBottom: '20px' },
  emptyText: { fontSize: '1.05rem', margin: '0 0 24px', color: '#6b5d54' },
  browseBtn: { padding: '11px 28px', background: '#d97334', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, display: 'inline-block' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' },
  card: { borderRadius: '16px', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #f5f0eb' },
  imgWrap: { position: 'relative', flexShrink: 0, overflow: 'hidden' },
  img: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' },
  favBtn: { position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.15rem', cursor: 'pointer', color: '#d97334', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },
  cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 },
  cardTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 14px 0', flex: 1, lineHeight: '1.5' },
  viewBtn: { display: 'inline-block', padding: '11px 24px', background: '#d97334', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, alignSelf: 'flex-start', marginTop: 'auto', transition: 'all 0.2s' },
}

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
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Favorites</h1>
        <p style={styles.subtitle}>
          {favoritedMeals.length === 0
            ? 'No favorites yet — heart a recipe to save it here.'
            : `${favoritedMeals.length} saved recipe${favoritedMeals.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {isLoading && <p style={{ textAlign: 'center', color: '#8b7d74', fontSize: '1.05rem' }}>Loading...</p>}
      {isError && <p style={{ textAlign: 'center', color: '#c83e3e', fontSize: '1.05rem' }}>Failed to load recipes. Please try again later.</p>}

      {!isLoading && !isError && favoritedMeals.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>You haven't saved any recipes yet.</p>
          <Link to="/" style={styles.browseBtn} onMouseEnter={(e) => (e.currentTarget.style.background = '#c85e24')} onMouseLeave={(e) => (e.currentTarget.style.background = '#d97334')}>
            Browse Recipes
          </Link>
        </div>
      )}

      {favoritedMeals.length > 0 && (
        <div style={styles.grid}>
          {favoritedMeals.map((meal) => (
            <div
              key={meal.idMeal}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.querySelector('img').style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.querySelector('img').style.transform = 'scale(1)'
              }}
            >
              <div style={styles.imgWrap}>
                <img src={meal.strMealThumb} alt={meal.strMeal} style={styles.img} />
                <button
                  onClick={() => dispatch(toggleFavorite(meal.idMeal))}
                  title="Remove from favorites"
                  style={{ ...styles.favBtn, fontSize: '1.3rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 115, 52, 0.25)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)')}
                >
                  ❤️
                </button>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{meal.strMeal}</h3>
                <Link
                  to={`/recipe/${meal.idMeal}`}
                  style={styles.viewBtn}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#c85e24')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#d97334')}
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