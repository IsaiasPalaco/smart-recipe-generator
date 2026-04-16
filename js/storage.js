export const storage = {
    saveFavorite(recipe) {
        let favorites = this.getFavorites();
        if (!favorites.some(fav => fav.id === recipe.id)) {
            favorites.push(recipe);
            localStorage.setItem('recipe_favorites', JSON.stringify(favorites));
        }
    },

    getFavorites() {
        return JSON.parse(localStorage.getItem('recipe_favorites')) || [];
    },

    removeFavorite(id) {
        let favorites = this.getFavorites().filter(fav => fav.id !== id);
        localStorage.setItem('recipe_favorites', JSON.stringify(favorites));
    }
};