export type Recipe = {
    id: number;
    title: string;
    likes: number;
    imageUrl: string;
    instructions: string[];
    readyTime: number;
  }

export type Details = {
  ingredients: Ingredient[];
  nutrition: string;
}

export type Ingredient = {
  amount: number;
  name: string;
  unit: string;
}

export type SetRecipesType = React.Dispatch<React.SetStateAction<Recipe[]>>