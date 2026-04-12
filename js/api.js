const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchRecipes(ingredients) {
  try {
    const response = await fetch(
      `${BASE_URL}findByIngredients?ingredients=${ingredients}&number=6&apiKey=${API_KEY}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export async function fetchRecipeDetails(id) {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  try {
    const response = await fetch(`${BASE_URL}${id}/information?includeNutrition=true&apiKey=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
  }
}