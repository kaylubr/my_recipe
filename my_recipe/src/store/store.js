import { configureStore } from '@reduxjs/toolkit'
import { recipeApi } from '../features/recipeApi'
import recipeReducer from '../features/recipeSlice'

export const store = configureStore({
  reducer: {
    [recipeApi.reducerPath]: recipeApi.reducer,
    recipes: recipeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recipeApi.middleware),
})