/**
 * API SERVICE MODULE
 * Fixed: Added quotes to API_KEY and ensured clean exports.
 */
const API_KEY = 'b4d6978b23644d9784aa583734336a92'; // String must be in quotes
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function fetchRecipes(ingredients, diet, maxTime) {
    try {
        // Validation: ensures ingredients are formatted for the URL
        const queryIngredients = encodeURIComponent(ingredients);
        const url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&includeIngredients=${queryIngredients}&diet=${diet}&maxReadyTime=${maxTime}&number=12&addRecipeInformation=true&fillIngredients=true`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("API Error (fetchRecipes):", error);
        return [];
    }
}

export async function fetchRecipeDetails(id) {
    try {
        const url = `${BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=true`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        return await response.json();
    } catch (error) {
        console.error("API Error (fetchRecipeDetails):", error);
        return null;
    }
}

export async function fetchDailyQuote() {
    try {
        const url = `https://api.spoonacular.com/food/jokes/random?apiKey=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data.text || "Cook with passion!";
    } catch (error) {
        console.error("API Error (fetchDailyQuote):", error);
        return "Happy cooking!";
    }
}