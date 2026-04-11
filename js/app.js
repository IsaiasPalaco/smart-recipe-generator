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

  document.getElementById('searchTitle').textContent =
    `Results for: ${ingredients}`;

  const mockRecipes = [
    {
      title: 'Chicken Rice Bowl',
      image: 'https://via.placeholder.com/300'
    },
    {
      title: 'Tomato Pasta',
      image: 'https://via.placeholder.com/300'
    },
    {
      title: 'Vegetable Stir Fry',
      image: 'https://via.placeholder.com/300'
    }
  ];

  const container = document.getElementById('recipesContainer');

  mockRecipes.forEach(recipe => {
    const card = `
      <div class="recipe-card">
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <button>View Recipe</button>
      </div>
    `;
    container.innerHTML += card;
  });
}