import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.themealdb.com/api/json/v1/1/' }),
  endpoints: (builder) => ({
    getSeafoodMeals: builder.query({
      query: () => 'filter.php?c=Seafood',
      transformResponse: (response) => response.meals || [],
    }),
    getMealById: builder.query({
      query: (id) => `lookup.php?i=${id}`,
      transformResponse: (response) => response.meals?.[0] || null,
    }),

    searchMeals: builder.query({
      query: (term) => `search.php?s=${encodeURIComponent(term)}`,
      transformResponse: (response) => response.meals || [],
    }),

  }),
})

export const {
  useGetSeafoodMealsQuery,
  useGetMealByIdQuery,

  useSearchMealsQuery,

} = recipeApi