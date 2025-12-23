// Complete product.js with ALL fixes - Replace entire file

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar filter controls
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const filterSidebar = document.getElementById('filter-sidebar');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const applyFiltersBtn = document.getElementById('apply-filters-btn');
  const clearAllFiltersBtn = document.getElementById('clear-all-filters');

  function openSidebar() {
    filterSidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    filterSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open sidebar
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', openSidebar);
  }

  // Close sidebar
  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeSidebar);
  }

  // Close when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Apply filters and close sidebar
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      applyFiltersAndSort();
      closeSidebar();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && filterSidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  // FILTER LOGIC
  const categoryButtons = document.querySelectorAll('.category-filters button, .gender-filters button');
  const productItems = document.querySelectorAll('.product-item');
  const sortSelect = document.getElementById('sort-select');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const applyPriceBtn = document.getElementById('apply-price');

  let activeCategories = new Set(['all']);
  let currentMinPrice = 0;
  let currentMaxPrice = Infinity;

  // Update quantity displays in product grid
  window.updateAllProductQuantities = function() {
    const cart = getCart();
    productItems.forEach(item => {
      const productName = item.querySelector('h3').textContent.trim();
      const qtyDisplay = item.querySelector('.qty-value');
      const cartItem = cart.find(c => c.name === productName);
      if (qtyDisplay) {
        qtyDisplay.textContent = cartItem ? cartItem.qty : 0;
      }
    });
  };

  // FILTERING & SORTING
  function applyFiltersAndSort() {
    let visible = Array.from(productItems);

    // Multi-category filter (includes gender)
    if (!activeCategories.has('all')) {
      visible = visible.filter(item => {
        const categories = (item.dataset.categories || '').split(' ').filter(Boolean);
        return Array.from(activeCategories).some(cat => categories.includes(cat));
      });
    }

    // Price filter
    visible = visible.filter(item => {
      const priceText = item.querySelector('.price').textContent.trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      return price >= currentMinPrice && price <= currentMaxPrice;
    });

    // Sorting
    if (sortSelect && sortSelect.value) {
      const sortBy = sortSelect.value;
      visible.sort((a, b) => {
        const nameA = a.querySelector('h3').textContent.toLowerCase();
        const nameB = b.querySelector('h3').textContent.toLowerCase();
        const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'name-asc') return nameA.localeCompare(nameB);
        if (sortBy === 'name-desc') return nameB.localeCompare(nameA);
        return 0;
      });
    }

    // Hide all, then show matching
    productItems.forEach(item => item.style.display = 'none');
    visible.forEach(item => item.style.display = 'block');
  }

  // Category & Gender button clicks (multi-select)
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      if (category === 'all') {
        activeCategories.clear();
        activeCategories.add('all');
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      } else {
        activeCategories.delete('all');
        document.querySelector('[data-category="all"]')?.classList.remove('active');

        if (activeCategories.has(category)) {
          activeCategories.delete(category);
          btn.classList.remove('active');
        } else {
          activeCategories.add(category);
          btn.classList.add('active');
        }

        if (activeCategories.size === 0) {
          activeCategories.add('all');
          document.querySelector('[data-category="all"]')?.classList.add('active');
        }
      }

      applyFiltersAndSort();
    });
  });

  // Sort select change
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFiltersAndSort);
  }

  // Price filter
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', () => {
      const min = parseFloat(minPriceInput.value) || 0;
      const max = parseFloat(maxPriceInput.value) || Infinity;

      if (min > max && max !== Infinity) {
        alert('Min price cannot be greater than max price');
        return;
      }

      currentMinPrice = min;
      currentMaxPrice = max;
      applyFiltersAndSort();
    });
  }

  // Enter key on price inputs
  [minPriceInput, maxPriceInput].forEach(input => {
    if (input) {
      input.addEventListener('keypress', e => {
        if (e.key === 'Enter') applyPriceBtn.click();
      });
    }
  });

  // Clear all filters
  if (clearAllFiltersBtn) {
    clearAllFiltersBtn.addEventListener('click', () => {
      // Reset categories
      activeCategories.clear();
      activeCategories.add('all');
      categoryButtons.forEach(b => b.classList.remove('active'));
      document.querySelector('[data-category="all"]')?.classList.add('active');

      // Reset price
      currentMinPrice = 0;
      currentMaxPrice = Infinity;
      if (minPriceInput) minPriceInput.value = '';
      if (maxPriceInput) maxPriceInput.value = '';

      // Reset sort
      if (sortSelect) sortSelect.value = 'featured';

      applyFiltersAndSort();
    });
  }

  // Initialize
  updateAllProductQuantities();
  applyFiltersAndSort();
});


function initEleganciaCart() {
  const CART_KEY = 'elegancia_cart';
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartBadge = document.getElementById('cart-badge');
  const closeBtn = document.getElementById('cart-close-btn');

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBadge();
    renderCart();
  }

  function updateBadge() {
    const totalItems = getCart().reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  window.addToCart = function(name, price = 0) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, qty: 1 });
    saveCart(cart);
    alert(`${name} added to cart!`);
  };

  window.changeQty = function(name, price, delta) {
    let cart = getCart();
    const item = cart.find(i => i.name === name);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
    }
    saveCart(cart);
  };

  function renderCart() {
    if (!cartItemsContainer || !cartTotalEl) return;

    const cart = getCart();
    let totalPrice = 0;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p style="text-align:center;color:#888;padding:40px 0;">Your cart is empty</p>`;
      cartTotalEl.textContent = 'Total: $0';

      const actions = cartModal.querySelector('#cart-footer-actions');
      if (actions) actions.remove();

      return;
    }

    cart.forEach(item => {
      totalPrice += item.price * item.qty;

      const itemHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid #eee;">
          <div style="flex:1;">
            <strong>${item.name}</strong><br>
            <small>$${item.price} × ${item.qty}</small>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button onclick="changeQty('${item.name}', ${item.price}, -1)"
                    style="width:34px;height:34px;border:none;border-radius:50%;background:#000;color:#D4AF37;font-weight:bold;cursor:pointer;">−</button>
            <span style="min-width:30px;text-align:center;font-weight:600;">${item.qty}</span>
            <button onclick="changeQty('${item.name}', ${item.price}, 1)"
                    style="width:34px;height:34px;border:none;border-radius:50%;background:#D4AF37;color:#fff;font-weight:bold;cursor:pointer;">+</button>
          </div>
        </div>`;
      cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    cartTotalEl.textContent = `Total: $${totalPrice.toFixed(2)}`;

  }

  function openCart() {
    cartModal.style.display = 'block';
    renderCart();
  }

  function closeCart() {
    cartModal.style.display = 'none';
  }

  function toggleCart(e) {
    if (e) e.preventDefault();
    if (cartModal.style.display === 'block') closeCart();
    else openCart();
  }

  if (cartIcon) cartIcon.addEventListener('click', toggleCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);

  document.addEventListener('click', (e) => {
    if (cartModal.style.display === 'block' && !cartModal.contains(e.target) && e.target !== cartIcon) {
      closeCart();
    }
  });

  cartModal.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  updateBadge();
  renderCart();
}

document.addEventListener('DOMContentLoaded', initEleganciaCart);
