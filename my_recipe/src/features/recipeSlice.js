import { createSlice } from '@reduxjs/toolkit'

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 8,
    favorites: [],
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
    },
  },
})

export const { setSearchQuery, setCurrentPage, toggleFavorite } = recipeSlice.actions
export default recipeSlice.reducer