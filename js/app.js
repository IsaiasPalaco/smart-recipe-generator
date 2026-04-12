import { fetchRecipes, fetchRecipeDetails } from './api.js';

if (document.getElementById('searchBtn')) {
  document.getElementById('searchBtn').addEventListener('click', () => {
    const ingredients = document.getElementById('ingredients').value;

    if (!ingredients) {
      alert('Please enter ingredients!');
      return;
    }

    window.location.href = `recipes.html?ingredients=${ingredients}`;
  });
}

if (document.getElementById('recipesContainer')) {
  const params = new URLSearchParams(window.location.search);
  const ingredients = params.get('ingredients');
  const container = document.getElementById('recipesContainer');
  const modal = document.getElementById('recipeModal');
  const modalDetails = document.getElementById('modalDetails');
  const closeBtn = document.querySelector('.close-btn');

  document.getElementById('searchTitle').textContent = `Results for: ${ingredients}`;

  async function loadRecipes() {
    const recipes = await fetchRecipes(ingredients);
    container.innerHTML = '';

    if (!recipes || recipes.length === 0) {
      container.innerHTML = '<p>No recipes found. Try different ingredients!</p>';
      return;
    }

    recipes.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <button class="view-btn" data-id="${recipe.id}">View Recipe</button>
      `;
      container.appendChild(card);
    });

    document.querySelectorAll('.view-btn').forEach(button => {
      button.addEventListener('click', () => {
        const recipeId = button.getAttribute('data-id');
        openRecipeDetails(recipeId);
      });
    });
  }

  async function openRecipeDetails(id) {
    modalDetails.innerHTML = '<p>Loading instructions...</p>';
    modal.style.display = "block";

    const details = await fetchRecipeDetails(id);

    if (details) {
      // Correção da lista de ingredientes  e informações nutricionais 
      modalDetails.innerHTML = `
        <h2 style="font-family: 'Poppins'">${details.title}</h2>
        <img src="${details.image}" style="width:100%; border-radius:8px; margin: 15px 0;">
        
        <div style="text-align: left; padding: 0 10px;">
          <h3>Ingredients:</h3>
          <ul>${details.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}</ul>
          
          <h3>Instructions:</h3>
          <div>${details.instructions || "Step-by-step instructions not available."}</div> [cite: 28]
          
          <hr style="margin: 20px 0;">
          <h3>Nutritional Info:</h3>
          <p><strong>Calories:</strong> ${Math.round(details.nutrition.nutrients[0].amount)} kcal</p>
        </div>
      `;
    }
  }

  if (closeBtn) {
    closeBtn.onclick = () => modal.style.display = "none";
  }

  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
  };

  loadRecipes();
}