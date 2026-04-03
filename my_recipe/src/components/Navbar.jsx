import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const injectFonts = () => {
  if (document.getElementById('recipe-fonts')) return
  const link = document.createElement('link')
  link.id = 'recipe-fonts'
  link.rel = 'stylesheet'
  link.href =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap'
  document.head.appendChild(link)
}

const Navbar = () => {
  useEffect(() => { injectFonts() }, [])

  const { favorites } = useSelector((s) => s.recipes)

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'white',
        borderBottom: '1.5px solid #eee',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#1b4f6b',
            letterSpacing: '-0.3px',
          }}
        >
          SeaRecipes
        </span>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { to: '/', label: 'Recipes', exact: true },
            { to: '/favorites', label: `Favorites${favorites.length ? ` (${favorites.length})` : ''}` },
          ].map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              style={({ isActive }) => ({
                padding: '7px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                background: isActive ? '#1b4f6b' : 'transparent',
                color: isActive ? 'white' : '#555',
                transition: 'background 0.15s, color 0.15s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar