import { fetchRecipes, fetchRecipeDetails } from './api.js';

if (document.getElementById('searchBtn')) {
  const searchBtn = document.getElementById('searchBtn');
  const ingredientsInput = document.getElementById('ingredients');
  const dietSelect = document.getElementById('dietFilter');
  const timeSelect = document.getElementById('maxTime');
  const historyContainer = document.getElementById('searchHistory');

  renderHistory();

  searchBtn.addEventListener('click', () => {
    const ingredients = ingredientsInput.value.trim();
    const diet = dietSelect ? dietSelect.value : '';
    const maxTime = timeSelect ? timeSelect.value : '';

    if (!ingredients) {
      alert('Please enter ingredients!');
      return;
    }

    saveToHistory(ingredients);
    window.location.href = `./recipes.html?ingredients=${encodeURIComponent(ingredients)}&diet=${diet}&maxTime=${maxTime}`;
  });

  function saveToHistory(term) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(term)) {
      history.unshift(term);
      if (history.length > 5) history.pop();
      localStorage.setItem('searchHistory', JSON.stringify(history));
    }
  }

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (historyContainer && history.length > 0) {
      historyContainer.innerHTML = '<p style="font-size: 0.8rem; color: #666; margin-top: 10px;">Recent searches:</p>';
      history.forEach(term => {
        const span = document.createElement('span');
        span.className = 'history-tag';
        span.textContent = term;
        span.style.cssText = "display:inline-block; background:#eee; padding:4px 8px; margin:4px; border-radius:4px; cursor:pointer; font-size:0.8rem;";
        span.onclick = () => { ingredientsInput.value = term; };
        historyContainer.appendChild(span);
      });
    }
  }
}

if (document.getElementById('recipesContainer') || document.getElementById('favoritesContainer')) {
  const container = document.getElementById('recipesContainer') || document.getElementById('favoritesContainer');
  const isFavoritesPage = !!document.getElementById('favoritesContainer');
  
  const modal = document.getElementById('recipeModal');
  const modalDetails = document.getElementById('modalDetails');
  const closeBtn = document.querySelector('.close-btn');

  const params = new URLSearchParams(window.location.search);
  const ingredients = params.get('ingredients') || '';
  const diet = params.get('diet') || '';
  const maxTime = params.get('maxTime') || '';

  const searchTitle = document.getElementById('searchTitle');
  if (!isFavoritesPage && searchTitle && ingredients) {
    searchTitle.textContent = `Results for: ${ingredients}`;
  }

  async function loadPageData() {
    let recipes = [];
    container.innerHTML = '<p>Loading...</p>';
    
    if (isFavoritesPage) {
      recipes = JSON.parse(localStorage.getItem('favorites')) || [];
    } else {
      recipes = await fetchRecipes(ingredients, diet, maxTime);
    }

    renderCards(recipes);
  }

  function renderCards(recipes) {
    container.innerHTML = '';

    if (!recipes || recipes.length === 0) {
      container.innerHTML = isFavoritesPage 
        ? '<p>You haven\'t saved any recipes yet.</p>' 
        : '<p>No recipes found. Try different ingredients or filters!</p>';
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    recipes.forEach(recipe => {
      const isFav = favorites.some(f => f.id == recipe.id);
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <img src="${recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <div style="display:flex; justify-content: space-between; padding: 10px; margin-top: auto;">
            <button class="view-btn" data-id="${recipe.id}">View Recipe</button>
            <button class="fav-btn" data-id="${recipe.id}" data-title="${recipe.title}" data-image="${recipe.image}" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color: ${isFav ? '#FF9800' : '#ccc'}">⭐</button>
        </div>
      `;
      container.appendChild(card);
    });

    document.querySelectorAll('.view-btn').forEach(button => {
      button.addEventListener('click', () => openRecipeDetails(button.getAttribute('data-id')));
    });

    document.querySelectorAll('.fav-btn').forEach(button => {
      button.addEventListener('click', (e) => {
          const id = button.getAttribute('data-id');
          const title = button.getAttribute('data-title');
          const image = button.getAttribute('data-image');
          const isNowFav = toggleFavorite({id, title, image});
          
          if (isFavoritesPage) {
            loadPageData(); 
          } else {
            button.style.color = isNowFav ? '#FF9800' : '#ccc';
          }
      });
    });
  }

  async function openRecipeDetails(id) {
    if (!modal) return;
    modalDetails.innerHTML = '<p>Loading instructions and nutrition...</p>';
    modal.style.display = "block";

    const details = await fetchRecipeDetails(id);

    if (details) {
      const calories = details.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 0;
      const protein = details.nutrition?.nutrients.find(n => n.name === 'Protein')?.amount || 0;
      const fat = details.nutrition?.nutrients.find(n => n.name === 'Fat')?.amount || 0;

      modalDetails.innerHTML = `
        <h2 style="font-family: 'Poppins'">${details.title}</h2>
        <img src="${details.image}" style="width:100%; border-radius:8px; margin: 15px 0;">
        
        <div style="text-align: left; padding: 0 10px; font-family: 'Open Sans'">
          <h3>Ingredients:</h3>
          <ul>${details.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}</ul>
          
          <h3>Instructions:</h3>
          <div style="margin-bottom: 20px;">${details.instructions || "Step-by-step instructions not available."}</div> 
          
          <div style="background: #eef9ee; padding: 15px; border-radius: 8px;">
            <h3>Nutritional Info (per serving):</h3> 
            <p><strong>Calories:</strong> ${Math.round(calories)} kcal</p>
            <p><strong>Protein:</strong> ${protein}g</p>
            <p><strong>Fat:</strong> ${fat}g</p>
          </div>
        </div>
      `;
    }
  }

  function toggleFavorite(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(f => f.id == recipe.id);
    let added = false;
    
    if (index === -1) {
      favorites.push(recipe);
      added = true;
    } else {
      favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return added;
  }

  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = "none"; };
  }

  window.onclick = (e) => { 
    if (modal && e.target == modal) modal.style.display = "none"; 
  };

  loadPageData();
}