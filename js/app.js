import { fetchRecipes, fetchRecipeDetails, fetchDailyQuote } from './api.js';
import { storage } from './storage.js';

// Global config to match storage.js
const STORAGE_KEY = 'recipe_favorites';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initSearchLogic();
    initDisplayLogic();
});

// --- SECTION: Landing Page (index.html) ---
function initSearchLogic() {
    const searchBtn = document.getElementById('searchBtn');
    if (!searchBtn) return;

    // Load Daily Quote
    fetchDailyQuote().then(quote => {
        const header = document.querySelector('.header');
        if (header && quote) {
            const p = document.createElement('p');
            p.style.cssText = "font-style: italic; color: #ffd180; font-size: 0.9rem; margin-top: 10px;";
            p.textContent = `"${quote}"`;
            header.appendChild(p);
        }
    });

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const ingredients = document.getElementById('ingredients').value.trim();
        const diet = document.getElementById('dietFilter')?.value || '';
        const maxTime = document.getElementById('maxTime')?.value || '';

        if (!ingredients) {
            alert("Please enter ingredients first!");
            return;
        }

        // Redirect with parameters
        window.location.href = `recipes.html?ingredients=${encodeURIComponent(ingredients)}&diet=${diet}&maxTime=${maxTime}`;
    });
}

// --- SECTION: Results & Favorites (recipes.html / favorites.html) ---
async function initDisplayLogic() {
    const recipesContainer = document.getElementById('recipesContainer');
    const favoritesContainer = document.getElementById('favoritesContainer');
    const container = recipesContainer || favoritesContainer;

    if (!container) return;

    const isFavPage = !!favoritesContainer;
    container.innerHTML = '<p>Loading...</p>';

    let recipes = [];

    if (isFavPage) {
        // Use the storage.js method
        recipes = storage.getFavorites();
    } else {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('ingredients');
        if (query) {
            recipes = await fetchRecipes(query, params.get('diet'), params.get('maxTime'));
        }
    }

    renderGrid(container, recipes, isFavPage);
}

function renderGrid(container, recipes, isFavPage) {
    container.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>${isFavPage ? "No favorites yet." : "No recipes found for these ingredients."}</p>`;
        return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="card-content" style="padding: 15px;">
                <h3>${recipe.title}</h3>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="view-btn" data-id="${recipe.id}">View</button>
                    <button class="fav-btn" data-id="${recipe.id}">⭐</button>
                </div>
            </div>
        `;
        container.appendChild(card);

        // Events
        card.querySelector('.view-btn').onclick = () => openModal(recipe.id);
        card.querySelector('.fav-btn').onclick = () => {
            if (isFavPage) {
                storage.removeFavorite(recipe.id);
                initDisplayLogic(); // Refresh
            } else {
                storage.saveFavorite(recipe.id); // You might need to pass the whole recipe object here
                storage.saveFavorite(recipe); 
                alert("Saved to favorites!");
            }
        };
    });
}

async function openModal(id) {
    const modal = document.getElementById('recipeModal');
    const details = document.getElementById('modalDetails');
    if (!modal) return;

    modal.style.display = "block";
    details.innerHTML = '<p>Loading details...</p>';
    
    const data = await fetchRecipeDetails(id);
    if (data) {
        details.innerHTML = `
            <h2>${data.title}</h2>
            <img src="${data.image}" style="width:100%; border-radius:10px;">
            <h3>Instructions:</h3>
            <p>${data.instructions || "Enjoy your meal!"}</p>
        `;
    }

    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
}