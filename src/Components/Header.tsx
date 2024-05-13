import { ChangeEvent, FormEvent, useState } from "react";
import { SetRecipesType, SetLoadingType } from "../types";

type HeaderProps = {
  setRecipes: SetRecipesType;
  setLoading: SetLoadingType;
};

const Header = ({ setRecipes, setLoading }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
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

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const noSpaceSearchTerm = searchTerm.replace(" ", "");
    const key = "e362ee8a688847febf87cdb4e1a22a92";
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${noSpaceSearchTerm}&number=6&addRecipeInformation=true&addRecipeInstructions=true`;
    if (isVegetarian && !isGlutenFree) {
      url += "&diet=vegetarian";
    }
    if (isGlutenFree && !isVegetarian) {
      url += "&diet=gluten-free";
    }
    if (isGlutenFree && isVegetarian) {
      url += "&diet=vegetarian,gluten-free";
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

  return (
    <div className="header">
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
        <label htmlFor="gluten-free"> Gluten-free</label>
      </form>
      {noResultsFound && <p>No results found. Try less ingredients/filters.</p>}
    </div>
  );
};

export default Header;
