/*
 * Implementing the CRUD (Create, Read, Delete) pattern using LocalStorage.
 * This module ensures that user favorites persist across browser sessions.
 */
export const storage = {
    
    /*
     * Data integrity check using the '.some()' method.
     * This prevents duplicate entries by verifying if the recipe ID already exists.
     */
    saveFavorite(recipe) {
        let favorites = this.getFavorites();
        
        // Defensive Programming: ensuring we don't save the same recipe twice
        if (!favorites.some(fav => fav.id === recipe.id)) {
            favorites.push(recipe);
            localStorage.setItem('recipe_favorites', JSON.stringify(favorites));
        }
    },

    /*
     * Handling JSON serialization/deserialization.
     * LocalStorage only stores strings, so we must parse the data back into a JS Object.
     * A fallback empty array '[]' is provided to prevent errors on the first run.
     */
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('recipe_favorites')) || [];
        } catch (error) {
            console.error("Storage Error: Failed to parse favorites", error);
            return [];
        }
    },

    /*
     * Learning Outcome: Using functional programming ('.filter()') to manage state.
     * This method creates a new array excluding the specific ID, then updates storage.
     */
    removeFavorite(id) {
        let favorites = this.getFavorites().filter(fav => fav.id !== id);
        localStorage.setItem('recipe_favorites', JSON.stringify(favorites));
    }
};