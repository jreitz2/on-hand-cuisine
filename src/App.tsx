import "./App.css";
import { useEffect, useState } from "react";
import Header from "./Components/Header.tsx";
import Results from "./Components/Results.tsx";
import { Recipe } from "./types";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const addToFavorites = (recipe: Recipe) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(
        (favorite) => favorite.id === recipe.id
      );

      if (isAlreadyFavorite) {
        return prevFavorites.filter((favorite) => favorite.id !== recipe.id);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div>
      <Header
        setRecipes={setRecipes}
        setLoading={setLoading}
        favorites={favorites}
      />
      <Results
        recipes={recipes}
        setLoading={setLoading}
        loading={loading}
        favorites={favorites}
        addToFavorites={addToFavorites}
      />
    </div>
  );
}

export default App;
