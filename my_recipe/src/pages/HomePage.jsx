import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetSeafoodMealsQuery } from '../features/recipeApi'
import { setSearchQuery, setCurrentPage, toggleFavorite } from '../features/recipeSlice'

// Inject Google Fonts once
const injectFonts = () => {
  if (document.getElementById('recipe-fonts')) return
  const link = document.createElement('link')
  link.id = 'recipe-fonts'
  link.rel = 'stylesheet'
  link.href =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap'
  document.head.appendChild(link)
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '3rem',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    color: '#111',
    margin: 0,
  },
  subtitle: {
    color: '#888',
    marginTop: '8px',
    fontSize: '0.95rem',
    fontStyle: 'italic',
  },
  searchWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '36px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '12px 20px',
    fontSize: '0.95rem',
    fontFamily: "'DM Sans', sans-serif",
    borderRadius: '999px',
    border: '1.5px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  card: {
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    background: 'white',
    display: 'flex',           // ← key fix
    flexDirection: 'column',   // ← key fix
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  imgWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  img: {
    width: '100%',
    aspectRatio: '4/3',
    objectFit: 'cover',
    display: 'block',
  },
  favBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.15s',
  },
  cardBody: {
    padding: '16px',
    display: 'flex',           // ← key fix
    flexDirection: 'column',   // ← key fix
    flex: 1,                   // ← key fix: body grows to fill card
  },
  cardTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#111',
    margin: '0 0 12px 0',
    flex: 1,                   // ← key fix: title takes remaining space
    lineHeight: '1.4',
  },
  viewBtn: {
    display: 'inline-block',
    padding: '9px 18px',
    background: '#1b4f6b',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.85rem',
    textDecoration: 'none',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    textAlign: 'center',
    alignSelf: 'flex-start',  // ← key fix: button stays at bottom
    marginTop: 'auto',        // ← key fix
    transition: 'background 0.2s',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  pageBtn: (active, disabled) => ({
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: active ? '#1b4f6b' : 'white',
    color: active ? 'white' : '#333',
    fontWeight: active ? 600 : 400,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    opacity: disabled ? 0.45 : 1,
    transition: 'background 0.15s',
  }),
}

const HomePage = () => {
  useEffect(() => { injectFonts() }, [])

  const dispatch = useDispatch()
  const { searchQuery, currentPage, itemsPerPage, favorites } = useSelector((s) => s.recipes)
  const { data: meals = [], isLoading, isError } = useGetSeafoodMealsQuery()

  const filtered = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Seafood Recipes</h1>
        <p style={styles.subtitle}>Masarap talaga seafood eh</p>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <input
          type="text"
          placeholder="Search seafood recipes..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          style={styles.searchInput}
          onFocus={(e) => (e.target.style.borderColor = '#1b4f6b')}
          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
        />
      </div>

      {/* States */}
      {isLoading && <p style={{ textAlign: 'center', color: '#888' }}>Loading recipes...</p>}
      {isError && <p style={{ textAlign: 'center', color: 'red' }}>Failed to load recipes.</p>}
      {!isLoading && filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888' }}>No recipes found for "{searchQuery}"</p>
      )}

      {/* Grid */}
      <div style={styles.grid}>
        {paginated.map((meal) => {
          const isFav = favorites.includes(meal.idMeal)
          return (
            <div
              key={meal.idMeal}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.13)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={styles.imgWrap}>
                <img src={meal.strMealThumb} alt={meal.strMeal} style={styles.img} />
                <button
                  onClick={() => dispatch(toggleFavorite(meal.idMeal))}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  style={{
                    ...styles.favBtn,
                    color: isFav ? '#e03e3e' : '#aaa',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isFav ? '♥' : '♡'}
                </button>
              </div>

              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{meal.strMeal}</h3>
                <Link
                  to={`/recipe/${meal.idMeal}`}
                  style={styles.viewBtn}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#153d54')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#1b4f6b')}
                >
                  View Recipe
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            disabled={currentPage === 1}
            style={styles.pageBtn(false, currentPage === 1)}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => dispatch(setCurrentPage(page))}
              style={styles.pageBtn(currentPage === page, false)}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            disabled={currentPage === totalPages}
            style={styles.pageBtn(false, currentPage === totalPages)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default HomePage