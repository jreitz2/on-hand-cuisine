import RecipeDetails from "./RecipeDetails";
import { Recipe, SetLoadingType } from "../types";
import { useEffect, useState } from "react";
import clockIcon from "../assets/clock.png";
import bookmarkOutline from "../assets/bookmark-outline.png";

type ResultsProps = {
  recipes: Recipe[];
  loading: boolean;
  setLoading: SetLoadingType;
  addToFavorites: (recipe: Recipe) => void;
  favorites: Recipe[];
};

const Results = ({
  recipes,
  loading,
  setLoading,
  favorites,
  addToFavorites,
}: ResultsProps) => {
  const [listItems, setListItems] = useState<JSX.Element[]>([]);
  const [modalStates, setModalStates] = useState<boolean[]>([]);

  useEffect(() => {
    if (recipes && recipes.length > 0) {
      const imageLoadPromises = recipes.map((recipe: Recipe) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.src = recipe.imageUrl;
          image.onload = () => resolve(image);
          image.onerror = (error) => reject(error);
        });
      });

      Promise.all(imageLoadPromises)
        .then(() => {
          const mappedItems = recipes.map((recipe: Recipe, index: number) => (
            <li key={recipe.id}>
              <div className="recipe-card" onClick={() => toggleModal(index)}>
                <div className="recipe-image-wrapper">
                  <img src={recipe.imageUrl} alt="finished dish" />
                  <div className="recipe-image-text">
                    <p>
                      {recipe.likes} {recipe.likes === 1 ? "like" : "likes"}
                    </p>
                    <div className="recipe-image-clock">
                      <img src={clockIcon} alt="cook and prep time" />
                      {recipe.readyTime} minutes
                    </div>
                  </div>
                </div>
                <div className="recipe-card-title">
                  <span>{recipe.title}</span>
                  <img
                    src={bookmarkOutline}
                    alt="save recipe"
                    onClick={(e) => handleBookmarkClick(e, recipe)}
                  />
                </div>
              </div>
              <RecipeDetails
                recipe={recipe}
                isModalOpen={modalStates[index]}
                toggleModal={() => toggleModal(index)}
              />
            </li>
          ));
          setListItems(mappedItems);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error preloading images:", error);
        });
    }
  }, [recipes, modalStates, favorites]);

  const toggleModal = (index: number) => {
    const updatedModalStates = [...modalStates];
    updatedModalStates[index] = !updatedModalStates[index];
    setModalStates(updatedModalStates);
  };

  const handleBookmarkClick = (event: React.MouseEvent, recipe: Recipe) => {
    event.stopPropagation();
    addToFavorites(recipe);
  };

  return (
    <div>
      {loading ? (
        <p className="loading">Loading recipes...</p>
      ) : (
        <ul className="recipe-card-list">{listItems}</ul>
      )}
    </div>
  );
};

export default Results;
