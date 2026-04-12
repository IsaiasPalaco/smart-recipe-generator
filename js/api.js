const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function fetchRecipes(ingredients) {
  try {

    const response = await fetch(
      `${BASE_URL}/findByIngredients?ingredients=${ingredients}&number=6&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export async function fetchRecipeDetails(id) {
  try {

    const response = await fetch(
      `${BASE_URL}/${id}/information?includeNutrition=true&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Erro nos detalhes: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    return null;
  }
}