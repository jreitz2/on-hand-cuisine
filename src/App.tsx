import "./App.css";
import { useState } from "react";
import Header from "./Components/Header.tsx";
import Results from "./Components/Results.tsx";
import { Recipe } from "./types";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Header setRecipes={setRecipes} setLoading={setLoading} />
      <Results recipes={recipes} setLoading={setLoading} loading={loading} />
    </div>
  );
}

export default App;
