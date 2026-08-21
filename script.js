const API_URL = 'https://fakestoreapi.com/products';
const catalog = document.getElementById('catalog');
const loader = document.getElementById('loader');
const error = document.getElementById('error');

let products = [];
let currentCategory = 'all';

// ===== Загрузка данных =====
async function fetchProducts() {
  loader.classList.add('show');
  error.classList.remove('show');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Ошибка загрузки');
    products = await response.json();
    renderProducts(products);
  } catch (err) {
    error.textContent = '⚠️ Не удалось загрузить товары. Попробуйте позже.';
    error.classList.add('show');
    catalog.innerHTML = '';
  } finally {
    loader.classList.remove('show');
  }
}

// ===== Рендер =====
function renderProducts(items) {
  if (items.length === 0) {
    catalog.innerHTML = `<p class="empty">😕 Товаров не найдено</p>`;
    return;
  }

  catalog.innerHTML = items.map(product => `
    <div class="product-card">
      <img class="product-card__image" src="${product.image}" alt="${product.title}" loading="lazy">
      <h3 class="product-card__title">${product.title}</h3>
      <p class="product-card__category">${product.category}</p>
      <p class="product-card__price">$${product.price}</p>
    </div>
  `).join('');
}

// ===== Фильтр =====
function filterProducts(category) {
  currentCategory = category;

  document.querySelectorAll('.filter__btn').forEach(btn => {
    btn.classList.toggle('filter__btn--active', btn.dataset.category === category);
  });

  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  renderProducts(filtered);
}

// ===== Обработчики =====
document.querySelectorAll('.filter__btn').forEach(btn => {
  btn.addEventListener('click', () => filterProducts(btn.dataset.category));
});

// ===== Запуск =====
fetchProducts();