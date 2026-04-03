import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetSeafoodMealsQuery } from '../features/recipeApi'
import { setSearchQuery, setCurrentPage, toggleFavorite } from '../features/recipeSlice'

const HomePage = () => {
  const dispatch = useDispatch()
  const { searchQuery, currentPage, itemsPerPage, favorites } = useSelector((s) => s.recipes)
  const { data: meals = [], isLoading, isError } = useGetSeafoodMealsQuery()

  const filtered = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Recipes</h1>
        <p style={{ color: '#666' }}>Masarap talaga seafood eh</p>
      </div>

      {/* Search Bar */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="Search seafood recipes..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '12px 20px',
            fontSize: '1rem',
            borderRadius: '999px',
            border: '2px solid #ddd',
            outline: 'none',
          }}
        />
      </div>

      {/* States */}
      {isLoading && <p style={{ textAlign: 'center' }}>Loading recipes...</p>}
      {isError && <p style={{ textAlign: 'center', color: 'red' }}>Failed to load recipes.</p>}
      {!isLoading && filtered.length === 0 && (
        <p style={{ textAlign: 'center' }}>No recipes found for "{searchQuery}"</p>
      )}

      {/* Recipe Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {paginated.map((meal) => {
          const isFav = favorites.includes(meal.idMeal)
          return (
            <div key={meal.idMeal} style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              background: 'white',
              transition: 'transform 0.2s',
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                />
                <button
                  onClick={() => dispatch(toggleFavorite(meal.idMeal))}
                  style={{
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {isFav ? '♥' : '♡'}
                </button>
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>{meal.strMeal}</h3>
                <Link
                  to={`/recipe/${meal.idMeal}`}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: '#1b4f6b',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                  }}
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              background: 'white',
            }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => dispatch(setCurrentPage(page))}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                cursor: 'pointer',
                background: currentPage === page ? '#1b4f6b' : 'white',
                color: currentPage === page ? 'white' : 'black',
                fontWeight: currentPage === page ? 'bold' : 'normal',
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              background: 'white',
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default HomePage