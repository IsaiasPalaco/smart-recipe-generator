document.getElementById('searchBtn').addEventListener('click', () => {
  const ingredients = document.getElementById('ingredients').value;

  if (!ingredients) {
    alert('Please enter ingredients!');
    return;
  }


  window.location.href = `recipes.html?ingredients=${ingredients}`;
});