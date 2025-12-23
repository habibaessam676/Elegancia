// cart.js — Fixed and simplified

const CART_KEY = 'elegancia_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  if (typeof updateAllProductQuantities === 'function') {
    updateAllProductQuantities();
  }
  renderCart();
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function changeQuantity(name, price, delta) {
  let cart = getCart();
  const item = cart.find(i => i.name === name);

  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
  } else if (delta > 0) {
    cart.push({ name, price, qty: delta });
  }

  saveCart(cart);
}

function clearCart() {
  if (confirm('Are you sure you want to empty your cart?')) {
    localStorage.removeItem(CART_KEY);
    saveCart([]);
  }
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const clearBtn = document.getElementById('clear-cart-btn');
  
  if (!container || !totalEl) return;

  const cart = getCart();
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:30px;color:#888;">Your cart is empty</p>';
    totalEl.textContent = 'Total: $0';
    if (clearBtn) clearBtn.style.display = 'none';
    return;
  }

  if (clearBtn) clearBtn.style.display = 'block';
  container.innerHTML = '';

  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.style = 'padding:15px 0; border-bottom:1px solid #eee;';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="flex:1;">
          <strong>${item.name}</strong><br>
          <small>$${item.price} × ${item.qty}</small>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <button onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', ${item.price}, -1)"
                  style="width:34px;height:34px;border:none;border-radius:50%;background:#000;color:#D4AF37;font-weight:bold;cursor:pointer;">−</button>
          <span style="min-width:30px;text-align:center;font-weight:600;">${item.qty}</span>
          <button onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', ${item.price}, 1)"
                  style="width:34px;height:34px;border:none;border-radius:50%;background:#D4AF37;color:#fff;font-weight:bold;cursor:pointer;">+</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

// GLOBAL TOGGLE FUNCTION (works from anywhere)
function toggleCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    if (modal.style.display === 'block') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'block';
      renderCart();
    }
  }
}

// Initialize
(function() {
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.getElementById('cart-close-btn');

    // Cart icon - using onclick directly
    if (cartIcon) {
      cartIcon.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCart();
        return false;
      };
    }

    // Close button
    if (closeBtn) {
      closeBtn.onclick = function(e) {
        e.preventDefault();
        if (cartModal) cartModal.style.display = 'none';
        return false;
      };
    }

    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (cartModal && cartModal.style.display === 'block') {
        if (!cartModal.contains(e.target) && e.target.id !== 'cart-icon' && !e.target.closest('#cart-icon')) {
          cartModal.style.display = 'none';
        }
      }
    });

    // Prevent modal clicks from closing
    if (cartModal) {
      cartModal.onclick = function(e) {
        e.stopPropagation();
      };
    }

    // Initialize display
    updateCartBadge();
    renderCart();
  }
})();