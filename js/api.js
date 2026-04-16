const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function fetchRecipes(ingredients, diet = '', maxTime = '') {
  try {
    let url = `${BASE_URL}/complexSearch?includeIngredients=${ingredients}&number=6&addRecipeInformation=true&fillIngredients=true&apiKey=${API_KEY}`;

    if (diet) {
      url += `&diet=${diet}`;
    }

    if (maxTime) {
      url += `&maxReadyTime=${maxTime}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
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
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
}