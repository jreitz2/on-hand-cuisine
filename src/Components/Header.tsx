import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SetRecipesType, SetLoadingType } from "../types";

type HeaderProps = {
  setRecipes: SetRecipesType;
  setLoading: SetLoadingType;
};

const Header = ({ setRecipes, setLoading }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("bacon, sugar, flour");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isDairyFree, setIsDairyFree] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isKetogenic, setIsKetogenic] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleVegChange = () => {
    setIsVegetarian(!isVegetarian);
  };

  const handleGlutenChange = () => {
    setIsGlutenFree(!isGlutenFree);
  };

  const handleDairyChange = () => {
    setIsDairyFree(!isDairyFree);
  };

  const handleVeganChange = () => {
    setIsVegan(!isVegan);
  };

  const handleKetogenicChange = () => {
    setIsKetogenic(!isKetogenic);
  };

  const handleSearch = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);
    const noSpaceSearchTerm = searchTerm.replace(" ", "");
    const key = import.meta.env.VITE_API_KEY;
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${noSpaceSearchTerm}&number=20&addRecipeInformation=true&addRecipeInstructions=true`;
    let diets = [];
    if (isVegetarian) diets.push("vegetarian");
    if (isGlutenFree) diets.push("gluten-free");
    if (isDairyFree) diets.push("ovo-vegetarian");
    if (isVegan) diets.push("vegan");
    if (isKetogenic) diets.push("ketogenic");

    if (diets.length > 0) {
      url += `&diet=${diets.join(",")}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.results.length === 0) {
        setNoResultsFound(true);
      } else {
        const formattedData = data.results.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          likes: recipe.aggregateLikes,
          imageUrl: recipe.image,
          instructions: recipe.analyzedInstructions
            ? recipe.analyzedInstructions.flatMap((instruction: any) =>
                instruction.steps.map((step: any) => step.step)
              )
            : [],
          readyTime: recipe.readyInMinutes,
        }));
        setRecipes(formattedData);
        setNoResultsFound(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="header">
      <h1>On-hand Cuisine</h1>
      <p>Find recipes for the ingredients you already have on-hand!</p>
      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="bacon, sugar, flour"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <button type="submit">Search</button>
        <br />
        <input
          type="checkbox"
          id="vegetarian"
          name="vegetarian"
          checked={isVegetarian}
          onChange={handleVegChange}
        />
        <label htmlFor="vegetarian"> Vegetarian </label>
        <input
          type="checkbox"
          id="gluten-free"
          name="gluten-free"
          checked={isGlutenFree}
          onChange={handleGlutenChange}
        />
        <label htmlFor="gluten-free"> Gluten-free </label>
        <input
          type="checkbox"
          id="dairy-free"
          name="dairy-free"
          checked={isDairyFree}
          onChange={handleDairyChange}
        />
        <label htmlFor="vegan"> Dairy-free </label>

        <input
          type="checkbox"
          id="vegan"
          name="vegan"
          checked={isVegan}
          onChange={handleVeganChange}
        />
        <label htmlFor="vegan"> Vegan </label>

        <input
          type="checkbox"
          id="ketogenic"
          name="ketogenic"
          checked={isKetogenic}
          onChange={handleKetogenicChange}
        />
        <label htmlFor="ketogenic"> Ketogenic </label>
      </form>
      {noResultsFound && <p>No results found. Try less ingredients/filters.</p>}
    </div>
  );
};

export default Header;
