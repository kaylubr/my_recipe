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
        borderBottom: '1px solid #f0e6dd',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.6rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #d97334 0%, #c85e24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
          }}
        >
          RecipeHub
        </span>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { to: '/', label: 'Recipes', exact: true },
            { to: '/favorites', label: `Favorites${favorites.length ? ` (${favorites.length})` : ''}` },
          ].map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              style={({ isActive }) => ({
                padding: '9px 18px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: isActive ? 600 : 500,
                background: isActive ? '#d97334' : 'transparent',
                color: isActive ? 'white' : '#6b5d54',
                transition: 'all 0.2s',
                border: isActive ? 'none' : '1.5px solid transparent',
              })}
              onMouseEnter={(e) => {
                if (!window.location.pathname.endsWith(e.currentTarget.getAttribute('href'))) {
                  e.currentTarget.style.background = '#f5f0eb'
                }
              }}
              onMouseLeave={(e) => {
                if (!window.location.pathname.endsWith(e.currentTarget.getAttribute('href'))) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
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