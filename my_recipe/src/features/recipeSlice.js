import { createSlice } from '@reduxjs/toolkit'

// Load favorites from localStorage so they survive page refresh
const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('recipe-favorites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveFavorites = (favorites) => {
  try {
    localStorage.setItem('recipe-favorites', JSON.stringify(favorites))
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 8,
    favorites: loadFavorites(),
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    toggleFavorite: (state, action) => {
      const id = action.payload
      const idx = state.favorites.indexOf(id)
      if (idx === -1) state.favorites.push(id)
      else state.favorites.splice(idx, 1)
      saveFavorites(state.favorites)
    },
  },
})

export const { setSearchQuery, setCurrentPage, toggleFavorite } = recipeSlice.actions
export default recipeSlice.reducer