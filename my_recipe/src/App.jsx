import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RecipeDetailPage from './pages/RecipeDetailPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipe/:id" element={<RecipeDetailPage />} />
    </Routes>
  )
}

export default App