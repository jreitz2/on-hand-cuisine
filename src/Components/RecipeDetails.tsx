import { useEffect, useState } from "react";
import { Recipe, Details } from "../types.tsx";

type RecipeDetailsProps = {
  recipe: Recipe;
  isModalOpen: boolean;
  toggleModal: () => void;
};

const RecipeDetails = ({
  recipe,
  isModalOpen,
  toggleModal,
}: RecipeDetailsProps) => {
  const [details, setDetails] = useState<Details>({
    ingredients: [],
    nutrition: "",
  });

  useEffect(() => {
    if (isModalOpen) {
      const fetchDetails = async () => {
        const key = import.meta.env.VITE_API_KEY;
        try {
          const response = await fetch(
            `https://api.spoonacular.com/recipes/${recipe.id}/nutritionLabel?apiKey=${key}`
          );
          const data = await response.text();
          const response2 = await fetch(
            `https://api.spoonacular.com/recipes/${recipe.id}/ingredientWidget.json?apiKey=${key}`
          );
          const data2 = await response2.json();

          const uniqueIngredients = new Set();

          const ingredientsArray = data2.ingredients
            .map((item: any) => {
              const ingredient = {
                name: item.name,
                amount: item.amount.us.value,
                unit: item.amount.us.unit,
              };

              const ingredientKey = `${ingredient.name}-${ingredient.amount}-${ingredient.unit}`;
              if (!uniqueIngredients.has(ingredientKey)) {
                uniqueIngredients.add(ingredientKey);
                return ingredient;
              }
              return null;
            })
            .filter(Boolean);

          console.log(data2);
          setDetails({
            ...details,
            nutrition: data,
            ingredients: ingredientsArray,
          });
        } catch (err) {
          console.log(err);
        }
      };
      fetchDetails();
    } else {
      setDetails({ ingredients: [], nutrition: "" });
    }
  }, [isModalOpen]);

  const ingredientList = details.ingredients.map(
    (ingredient, index: number) => (
      <li key={`${ingredient.name}-ingredient-${index}`}>
        {ingredient.amount} {ingredient.unit} {ingredient.name}
      </li>
    )
  );

  const instructionList = recipe.instructions.map(
    (instruction: string, index: number) => (
      <span key={`${recipe.id}-instruction-${index}`}>{instruction}</span>
    )
  );
  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{recipe.title}</h2>
          <button onClick={toggleModal}>Close</button>
        </div>
        <div className="modal-body">
          <div className="modal-ingredients">
            <div>
              <img src={recipe.imageUrl} alt="finished dish" />
              <h3>Ingredients</h3>
              <ul className="indented-list">{ingredientList}</ul>
            </div>
            <div className="modal-nutrition">
              <div dangerouslySetInnerHTML={{ __html: details.nutrition }} />
            </div>
          </div>
          <h3>Instructions</h3>
          <ul className="indented-list">
            <p>{instructionList}</p>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
