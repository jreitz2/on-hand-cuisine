import RecipeDetails from "./RecipeDetails";
import { Recipe } from "../types";
import { useEffect, useState } from "react";
import clockIcon from '../assets/clock.png'
import moreIcon from '../assets/more.png'

type ResultsProps = {
    recipes: Recipe[];
}

const Results = ({ recipes }: ResultsProps ) => {

    const [ listItems, setListItems ] = useState<JSX.Element[]>([])
    const [ modalStates, setModalStates ] = useState<boolean[]>([])

    useEffect(() => {
        if (recipes && recipes.length > 0) {
            const mappedItems = recipes.map((recipe: Recipe, index: number) => (
                <li key={recipe.id}>
                    <div className="recipe-card">
                        <div className="recipe-image-wrapper">
                            <img src={recipe.imageUrl} alt="finished dish" />
                            <div className="recipe-image-text">
                                <p>{recipe.likes} {recipe.likes === 1 ? 'like' : 'likes'}</p>
                                <div className="recipe-image-clock">
                                    <img src={clockIcon} alt="cook and prep time" />
                                    {recipe.readyTime} minutes
                                </div>
                            </div>
                        </div>
                        <div className="recipe-card-title">
                            {recipe.title}
                            <img src={moreIcon} alt="show details" onClick={() => toggleModal(index)} />
                        </div>
                    </div>
                    <RecipeDetails recipe={recipe} isModalOpen={modalStates[index]} toggleModal={() => toggleModal(index)} />
                </li>
            ))
            setListItems(mappedItems)
        }
    }, [recipes, modalStates])
    
    const toggleModal = (index: number) => {
        const updatedModalStates = [...modalStates]
        updatedModalStates[index] = !updatedModalStates[index]
        setModalStates(updatedModalStates)
    }

    return ( 
        <div>
            <ul className="recipe-card-list">
                {listItems}
            </ul>
        </div>
     );
}
 
export default Results;