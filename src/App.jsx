import viteLogo from '/vite.svg'
import './App.css'
import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_APP_KEY

function App() {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?number=50&addRecipeInformation=true&apiKey=${API_KEY}`
        )
        const data = await res.json()
        setRecipes(data.results)
      } catch (err) {
        setError('Failed to fetch recipes')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const filteredRecipes = recipes
    .filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(recipe =>
      filter ? recipe.dishTypes?.includes(filter) : true
    )

  return (
    <div className="whole-page">
      <div className="title-head">
        <h1>Recipe Findr</h1>
        <h3>Browse delicious recipes!</h3>
    </div>

      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-dropdown">
        <option value="">All Types</option>
        <option value="main course">Main Course</option>
        <option value="side dish">Side Dish</option>
        <option value="dessert">Dessert</option>
        <option value="salad">Salad</option>
        <option value="soup">Soup</option>
      </select>

      <div className="stats">
        <p>Total Recipes: {recipes.length}</p>
        <p>Vegetarian: {recipes.filter(r => r.vegetarian).length}</p>
        <p>Gluten Free: {recipes.filter(r => r.glutenFree).length}</p>
      </div>

      <div className="recipe-list">
        {!loading && filteredRecipes.length === 0 && <p>No recipes found.</p>}
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <img className="food-image" src={recipe.image} alt={recipe.title} />
            <h2>{recipe.title}</h2>
            <p>⏱ {recipe.readyInMinutes} min</p>
            <p>Health Score: {recipe.healthScore}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
