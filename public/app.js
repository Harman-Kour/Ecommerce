const state = {
  users: [],
  products: [],
  cart: { items: [], total: 0 },
  orders: [],
  activeUserId: null,
  search: '',
  category: ''
};

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const categoryColors = ['#fff1b8', '#e5f6df', '#e9f1ff', '#ffe6e2', '#eef1ff', '#e4f7f4'];

const imageMap = {
  vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=420&q=80',
  fruits: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=420&q=80',
  dairy: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=420&q=80',
  breakfast: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=420&q=80',
  snacks: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=420&q=80',
  munchies: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=420&q=80',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=420&q=80',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=420&q=80',
  apparel: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=420&q=80',
  general: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=420&q=80'
};

const elements = {
  apiStatus: document.querySelector('#apiStatus'),
  productGrid: document.querySelector('#productGrid'),
  productCount: document.querySelector('#productCount'),
  productForm: document.querySelector('#productForm'),
  userForm: document.querySelector('#userForm'),
  userSelect: document.querySelector('#userSelect'),
  cartList: document.querySelector('#cartList'),
  cartTotal: document.querySelector('#cartTotal'),
  ordersList: document.querySelector('#ordersList'),
  checkoutButton: document.querySelector('#checkoutButton'),
  clearCartButton: document.querySelector('#clearCartButton'),
  refreshButton: document.querySelector('#refreshButton'),
  searchInput: document.querySelector('#searchInput'),
  categoryRail: document.querySelector('#categoryRail'),
  toast: document.querySelector('#toast')
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload.data ?? payload;
}

async function checkHealth() {
  try {
    await api('/health');
    elements.apiStatus.className = 'status-pill ok';
    elements.apiStatus.innerHTML = '<span></span> Online';
  } catch (error) {
    elements.apiStatus.className = 'status-pill error';
    elements.apiStatus.innerHTML = '<span></span> Offline';
  }
}

async function loadAll() {
  await checkHealth();
  const [users, products, orders] = await Promise.all([
    api('/api/users'),
    api('/api/products'),
    api('/api/orders')
  ]);

  state.users = users;
  state.products = products;
  state.orders = orders;
  state.activeUserId = state.activeUserId || users[0]?.id || null;

  renderUsers();
  renderCategories();
  renderProducts();
  renderOrders();
  await loadCart();
}

async function loadCart() {
  if (!state.activeUserId) {
    state.cart = { items: [], total: 0 };
    renderCart();
    return;
  }

  state.cart = await api(`/api/cart/${state.activeUserId}`);
  renderCart();
}

function renderUsers() {
  if (state.users.length === 0) {
    elements.userSelect.innerHTML = '<option value="">Create a customer first</option>';
    elements.userSelect.disabled = true;
    return;
  }

  elements.userSelect.disabled = false;
  elements.userSelect.innerHTML = state.users
    .map(user => `<option value="${user.id}">${escapeHtml(user.name)} (${escapeHtml(user.email)})</option>`)
    .join('');
  elements.userSelect.value = String(state.activeUserId);
}

function renderCategories() {
  const categories = ['All', ...new Set(state.products.map(product => product.category || 'General'))];

  elements.categoryRail.innerHTML = categories.map((category, index) => {
    const value = category === 'All' ? '' : category;
    const active = state.category === value;
    const label = category === 'All' ? 'All products' : category;
    const initial = category.slice(0, 1).toUpperCase();
    const color = categoryColors[index % categoryColors.length];

    return `
      <button class="category-chip ${active ? 'active' : ''}" type="button" data-category="${escapeHtml(value)}">
        <span class="category-image" style="--chip-bg: ${color}">${escapeHtml(initial)}</span>
        <strong>${escapeHtml(label)}</strong>
      </button>
    `;
  }).join('');
}

function renderProducts() {
  const visibleProducts = state.products.filter(product => {
    const query = state.search.toLowerCase();
    const matchesSearch = !query ||
      product.name.toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query);
    const matchesCategory = !state.category || product.category === state.category;
    return matchesSearch && matchesCategory;
  });

  elements.productCount.textContent = `${visibleProducts.length} items available`;

  if (visibleProducts.length === 0) {
    elements.productGrid.innerHTML = '<p class="empty-state">No products match this search.</p>';
    return;
  }

  elements.productGrid.innerHTML = visibleProducts.map(product => {
    const disabled = !state.activeUserId || product.stock <= 0;
    const packSize = packSizeFor(product);

    return `
      <article class="product-card">
        <div class="product-media">
          <img src="${imageFor(product)}" alt="${escapeHtml(product.name)}" loading="lazy" />
          <span class="delivery-tag">8 min</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">${escapeHtml(product.name)}</h3>
            <span class="pack-size">${escapeHtml(packSize)}</span>
          </div>
          <div class="product-meta">
            <div>
              <strong class="price">${money.format(product.price)}</strong>
              <div class="stock">${product.stock} left</div>
            </div>
            <form class="add-row" data-product-id="${product.id}">
              <input name="quantity" type="hidden" value="1" />
              <button type="submit" ${disabled ? 'disabled' : ''}>ADD</button>
            </form>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderCart() {
  const items = state.cart.items || [];

  if (!state.activeUserId) {
    elements.cartList.innerHTML = '<p class="empty-state">Create or select a customer to start shopping.</p>';
  } else if (items.length === 0) {
    elements.cartList.innerHTML = '<p class="empty-state">Your cart is waiting.</p>';
  } else {
    elements.cartList.innerHTML = items.map(item => `
      <div class="cart-item">
        <strong>${escapeHtml(item.product?.name || `Product #${item.productId}`)}</strong>
        <span>${item.quantity} x ${money.format(item.product?.price || 0)}</span>
      </div>
    `).join('');
  }

  elements.cartTotal.textContent = money.format(state.cart.total || 0);
  elements.checkoutButton.disabled = !state.activeUserId || items.length === 0;
  elements.clearCartButton.disabled = !state.activeUserId || items.length === 0;
}

function renderOrders() {
  const userOrders = state.activeUserId
    ? state.orders.filter(order => order.userId === state.activeUserId)
    : state.orders;

  if (userOrders.length === 0) {
    elements.ordersList.innerHTML = '<p class="empty-state">No orders yet.</p>';
    return;
  }

  elements.ordersList.innerHTML = userOrders.slice(0, 5).map(order => `
    <div class="order-item">
      <strong>Order #${order.id} · ${money.format(order.totalAmount || 0)}</strong>
      <span>${order.status} · ${order.items?.length || 0} items</span>
    </div>
  `).join('');
}

async function createUser(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const user = await api('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      name: form.get('name').trim(),
      email: form.get('email').trim(),
      password: form.get('password')
    })
  });

  state.users.unshift(user);
  state.activeUserId = user.id;
  event.currentTarget.reset();
  renderUsers();
  renderOrders();
  await loadCart();
  toast('Customer created');
}

async function createProduct(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const product = await api('/api/products', {
    method: 'POST',
    body: JSON.stringify({
      name: form.get('name').trim(),
      description: 'Freshly added store item',
      price: Number(form.get('price')),
      stock: Number(form.get('stock')),
      category: form.get('category').trim() || 'General'
    })
  });

  state.products.unshift(product);
  event.currentTarget.reset();
  renderCategories();
  renderProducts();
  toast('Product added');
}

async function addToCart(event) {
  const form = event.target.closest('.add-row');
  if (!form) return;

  event.preventDefault();
  const productId = Number(form.dataset.productId);
  const quantity = Number(new FormData(form).get('quantity'));

  state.cart = await api('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({
      userId: state.activeUserId,
      productId,
      quantity
    })
  });

  await loadCart();
  toast('Added to cart');
}

async function clearCart() {
  if (!state.activeUserId) return;
  await api(`/api/cart/${state.activeUserId}`, { method: 'DELETE' });
  await loadCart();
  toast('Cart cleared');
}

async function checkout() {
  const items = (state.cart.items || []).map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));

  if (!items.length) return;

  const order = await api('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      userId: state.activeUserId,
      items
    })
  });

  state.orders.unshift(order);
  state.products = await api('/api/products');
  await loadCart();
  renderCategories();
  renderProducts();
  renderOrders();
  toast(`Order #${order.id} created`);
}

function imageFor(product) {
  const category = `${product.category || ''} ${product.name || ''}`.toLowerCase();
  const match = Object.keys(imageMap).find(key => category.includes(key));
  return imageMap[match] || imageMap.general;
}

function packSizeFor(product) {
  const category = `${product.category || ''} ${product.name || ''}`.toLowerCase();
  if (category.includes('drink') || category.includes('juice')) return '1 l';
  if (category.includes('dairy') || category.includes('milk')) return '500 ml';
  if (category.includes('snack') || category.includes('chips')) return '1 pack';
  if (category.includes('fruit') || category.includes('vegetable')) return '500 g';
  if (category.includes('bakery') || category.includes('bread')) return '400 g';
  return '1 unit';
}

function toast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('visible');
  window.clearTimeout(toast.timeout);
  toast.timeout = window.setTimeout(() => {
    elements.toast.classList.remove('visible');
  }, 2200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function bindEvents() {
  elements.userForm.addEventListener('submit', handle(createUser));
  elements.productForm.addEventListener('submit', handle(createProduct));
  elements.productGrid.addEventListener('submit', handle(addToCart));
  elements.clearCartButton.addEventListener('click', handle(clearCart));
  elements.checkoutButton.addEventListener('click', handle(checkout));
  elements.refreshButton.addEventListener('click', handle(loadAll));
  elements.categoryRail.addEventListener('click', event => {
    const button = event.target.closest('.category-chip');
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    renderProducts();
  });
  elements.userSelect.addEventListener('change', handle(async event => {
    state.activeUserId = Number(event.target.value);
    renderOrders();
    await loadCart();
  }));
  elements.searchInput.addEventListener('input', event => {
    state.search = event.target.value;
    renderProducts();
  });
}

function handle(action) {
  return async event => {
    try {
      await action(event);
    } catch (error) {
      toast(error.message);
    }
  };
}

bindEvents();
loadAll().catch(error => {
  toast(error.message);
  checkHealth();
});
