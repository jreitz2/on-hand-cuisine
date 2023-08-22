import './App.css'
import { useState } from 'react'
import Header from './Components/Header.tsx'
import Results from './Components/Results.tsx'
import { Recipe } from './types'


function App() {
  
  const [ recipes, setRecipes ] = useState<Recipe[]>([])

  return (
    <div>
      <Header setRecipes={setRecipes} />
      <Results recipes={recipes} />
    </div>
  )
}

export default App
