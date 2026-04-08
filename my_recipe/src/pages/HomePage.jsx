import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetSeafoodMealsQuery, useGetChickenMealsQuery, useSearchMealsQuery } from '../features/recipeApi'
import { setSearchQuery, setCurrentPage, toggleFavorite } from '../features/recipeSlice'

const injectFonts = () => {
  if (document.getElementById('recipe-fonts')) return
  const link = document.createElement('link')
  link.id = 'recipe-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap'
  document.head.appendChild(link)
}

// Add animation keyframes
const animationStyles = document.createElement('style')
animationStyles.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeOutDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
  .food-cycle-text {
    animation: fadeInUp 0.8s ease-in-out;
  }
`
if (!document.getElementById('food-cycle-styles')) {
  animationStyles.id = 'food-cycle-styles'
  document.head.appendChild(animationStyles)
}

const styles = {
  // Hero section
  hero: { background: 'linear-gradient(135deg, #faf5f0 0%, #fff8f3 100%)', padding: '80px 24px 60px', textAlign: 'center', borderBottom: '1px solid #f0e6dd' },
  heroDeco: { maxWidth: '1200px', margin: '0 auto' },
  heroTag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#d97334', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px', padding: '8px 16px', background: 'rgba(217, 115, 52, 0.08)', borderRadius: '20px' },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '4rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px 0', letterSpacing: '-1px' },
  heroSubtitle: { fontFamily: "'DM Sans', sans-serif", color: '#6b5d54', fontSize: '1.1rem', margin: 0, fontWeight: 400, letterSpacing: '0.3px', minHeight: '32px' },
  
  // Main content
  page: { maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', fontFamily: "'DM Sans', sans-serif" },
  
  // Search
  searchWrap: { display: 'flex', justifyContent: 'center', marginBottom: '80px' },
  searchInput: { width: '100%', maxWidth: '500px', padding: '14px 24px', fontSize: '1rem', fontFamily: "'DM Sans', sans-serif", borderRadius: '12px', border: '2px solid #e8dcd2', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  
  // Section styling
  section: { marginBottom: '80px' },
  sectionHeader: { marginBottom: '40px' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px 0', letterSpacing: '-0.5px' },
  sectionSubtitle: { fontFamily: "'DM Sans', sans-serif", color: '#8b7d74', fontSize: '0.95rem', margin: 0, fontWeight: 400 },
  
  // Grid
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' },
  
  // Card
  card: { borderRadius: '16px', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #f5f0eb' },
  imgWrap: { position: 'relative', flexShrink: 0, overflow: 'hidden' },
  img: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' },
  favBtn: { position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.15rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },
  
  // Card body
  cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 },
  cardTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 14px 0', flex: 1, lineHeight: '1.5' },
  viewBtn: { display: 'inline-block', padding: '11px 24px', background: '#d97334', color: 'white', borderRadius: '10px', fontSize: '0.9rem', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textAlign: 'center', alignSelf: 'flex-start', marginTop: 'auto', transition: 'all 0.2s', border: 'none', cursor: 'pointer' },
  
  // Pagination
  pagination: { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '60px' },
  pageBtn: (active, disabled) => ({ padding: '10px 16px', borderRadius: '10px', border: '2px solid ' + (active ? '#d97334' : '#e8dcd2'), cursor: disabled ? 'not-allowed' : 'pointer', background: active ? '#d97334' : 'white', color: active ? 'white' : '#1a1a1a', fontWeight: active ? 600 : 500, fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', opacity: disabled ? 0.4 : 1, transition: 'all 0.2s' }),
}

const HomePage = () => {
  useEffect(() => { injectFonts() }, [])

  // Food cycling effect
  const foodDescriptions = [
    'Fresh seafood and delicious chicken dishes await you',
    'Explore Italian pasta and traditional flavors',
    'Discover Asian fusion and exotic tastes',
    'Indulge in comfort food classics',
    'Savor Mediterranean cuisine at its finest',
    'Experience spicy and bold flavors',
    'Enjoy light and healthy options',
    'Taste international delights from around the world',
  ]

  const [currentFoodIndex, setCurrentFoodIndex] = useState(0)

  useEffect(() => {
    const foodCycleInterval = setInterval(() => {
      setCurrentFoodIndex((prev) => (prev + 1) % foodDescriptions.length)
    }, 4000)
    return () => clearInterval(foodCycleInterval)
  }, [foodDescriptions.length])

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
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            style={{ ...styles.favBtn, color: isFav ? '#d97334' : '#ddd', fontSize: '1.3rem' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 115, 52, 0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)')}
          >
            {isFav ? '❤️' : '🤍'}
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
    )
  }

  return (
    <>
      {/* Hero Banner */}
      <div style={styles.hero}>
        <div style={styles.heroDeco}>
          <div style={styles.heroTag}>Explore Culinary Delights</div>
          <h1 style={styles.heroTitle}>Discover Recipes</h1>
          <p style={{ ...styles.heroSubtitle }} className="food-cycle-text" key={currentFoodIndex}>
            {foodDescriptions[currentFoodIndex]}
          </p>
        </div>
      </div>

      <div style={styles.page}>
        {/* Search Bar */}
        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search any recipe..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#d97334'
              e.target.style.boxShadow = '0 2px 16px rgba(217, 115, 52, 0.12)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e8dcd2'
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
            }}
          />
        </div>

        {isLoading && <p style={{ textAlign: 'center', color: '#8b7d74', fontSize: '1.05rem' }}>Loading delicious recipes...</p>}
        {isError && <p style={{ textAlign: 'center', color: '#c83e3e', fontSize: '1.05rem' }}>Failed to load recipes.</p>}
        {!isLoading && !isError && meals.length === 0 && (
          <p style={{ textAlign: 'center', color: '#8b7d74', fontSize: '1.05rem' }}>No recipes found for "{searchQuery}"</p>
        )}

        {/* Show categories only when not searching */}
        {!isSearching && !isLoading && !isError && (
          <>
            {/* Seafood Section */}
            {seafoodMeals.length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Seafood Specialties</h2>
                  <p style={styles.sectionSubtitle}>Dive into our fresh and delicious seafood collection</p>
                </div>
                <div style={styles.grid}>
                  {seafoodMeals.slice(0, 8).map(renderRecipeCard)}
                </div>
              </div>
            )}

            {/* Chicken Section */}
            {chickenMeals.length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Chicken Recipes</h2>
                  <p style={styles.sectionSubtitle}>Explore our favorite chicken recipes</p>
                </div>
                <div style={styles.grid}>
                  {chickenMeals.slice(0, 8).map(renderRecipeCard)}
                </div>
              </div>
            )}
          </>
        )}

        {/* Search Results with Pagination */}
        {isSearching && !isLoading && !isError && meals.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Search Results</h2>
              <p style={styles.sectionSubtitle}>Found {meals.length} recipe{meals.length !== 1 ? 's' : ''}</p>
            </div>
            <div style={styles.grid}>
              {paginated.map(renderRecipeCard)}
            </div>

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
        )}
      </div>
    </>
  )
}

export default HomePage