console.log("JavaScript loaded successfully");
  
// ------------------ Smooth Endless Carousel (JS Controlled Speed) ------------------
const track = document.querySelector('.carousel-track');
if (track) {
  const slides = Array.from(track.children);
  // Duplicate slides for smooth loop
  slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });
  // Movement variables
  let speed = 2.2; // 🔥 increase this value to go faster (try 2 or 3)
  let position = 0;
  function animateCarousel() {
    position -= speed;
    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0; // reset seamlessly when halfway
    }
    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animateCarousel);
  }
  animateCarousel();
}
document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const parent = question.closest(".faq-item");
      const isActive = parent.classList.contains("active");
      // Close all open answers
      document.querySelectorAll(".faq-item.active").forEach((item) => {
        item.classList.remove("active");
        item.querySelector(".faq-answer").style.display = "none";
      });
      // Open the clicked one if it wasn’t active
      if (!isActive) {
        parent.classList.add("active");
        parent.querySelector(".faq-answer").style.display = "block";
      }
    });
  });
});
// Pop-up Ad Script
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("popup-ad");
  const closeBtn = document.getElementsByClassName("close")[0];
  function showModal() {
    modal.style.display = "block";
  }
  // Initial show after 10 seconds
  setTimeout(showModal, 20000);
  // Close pop-up when clicking the close button
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
  // Close pop-up when clicking outside the modal
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

    // Cart functionality
    let cartItems = [];
    let totalPrice = 0;
    const cartIcon = document.getElementById("cart-icon");
    const cartModal = document.getElementById("cart-modal");
    const cartItemsContainer = document.getElementById("cart-items");

    // Initialize cart from localStorage
    document.addEventListener('DOMContentLoaded', function() {
      cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      updateCartIcon(cartItems.reduce((sum, item) => sum + item.quantity, 0));
      updateAllQuantityDisplays();
      if (cartItems.length > 0) {
        totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    });

    // Add click event listener for cart icon
    cartIcon.addEventListener("click", toggleCart);

    function changeQuantityOnPage(itemName, price, change) {
      const existingItemIndex = cartItems.findIndex(item => item.name === itemName);

      if (existingItemIndex !== -1) {
        const newQuantity = cartItems[existingItemIndex].quantity + change;

        if (newQuantity <= 0) {
          totalPrice -= cartItems[existingItemIndex].price * cartItems[existingItemIndex].quantity;
          cartItems.splice(existingItemIndex, 1);
        } else {
          cartItems[existingItemIndex].quantity = newQuantity;
          totalPrice += price * change;
        }
      } else if (change > 0) {
        cartItems.push({ name: itemName, price, quantity: 1 });
        totalPrice += price;
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      localStorage.setItem('cartTotal', totalPrice);
      updateCartDisplay();
      updateAllQuantityDisplays();
    }

    function updateAllQuantityDisplays() {
      document.querySelectorAll('.qty-value').forEach(elem => {
        elem.textContent = "0";
      });

      cartItems.forEach(item => {
        const qtyElement = document.getElementById(`qty-${item.name.replace(/\s+/g, '')}`);
        if (qtyElement) {
          qtyElement.textContent = item.quantity;
        }
      });
    }

    function addToCart(itemName, price) {
      changeQuantityOnPage(itemName, price, 1);
    }

    function updateCartDisplay() {
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartIcon.setAttribute("data-count", totalItems);

      cartItemsContainer.innerHTML = '';

      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-item">Your cart is empty</div>';
        document.getElementById("cart-total").textContent = "Total: $0";
        return;
      }

      cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        cartItemsContainer.innerHTML += `
          <div class="cart-item">
            <div>${item.name} - $${item.price}</div>
            <div style="display: flex; align-items: center; margin-top: 5px;">
              <button onclick="decreaseQuantity(${index})" style="width: 25px; height: 25px; padding: 0; background: #000000; color: #D4AF37;">-</button>
              <span style="margin: 0 10px;">${item.quantity}</span>
              <button onclick="increaseQuantity(${index})" style="width: 25px; height: 25px; padding: 0; background: #D4AF37; color: #FFFFFF;">+</button>
              <span style="margin-left: 15px;">$${itemTotal}</span>
            </div>
          </div>`;
      });

      document.getElementById("cart-total").textContent = `Total: $${totalPrice}`;
    }

    function increaseQuantity(index) {
      const item = cartItems[index];
      changeQuantityOnPage(item.name, item.price, 1);
    }

    function decreaseQuantity(index) {
      const item = cartItems[index];
      changeQuantityOnPage(item.name, item.price, -1);
    }

    function toggleCart() {
      cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    }

    function proceedToPayment() {
      if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to payment.");
        return;
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      localStorage.setItem('cartTotal', totalPrice);

      // Assuming payment page is 'payment_e.html'
      window.location.href = 'payment_e.html';
    }
    
    // Universal Search - Searches everything on the website

document.addEventListener('DOMContentLoaded', () => {
  const searchIcon = document.querySelector('.icon-linkS');
  const searchModal = document.getElementById('search-modal');
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const filterChips = document.querySelectorAll('.filter-chip');

  // Comprehensive searchable content from your website
  const searchableContent = [
    // Products
    { type: 'product', name: 'Kirke', desc: 'Peach, vanilla, musk, tropical fruits. Juicy and sweet.', price: '6,000LE', link: 'product_e.html', tags: ['perfume', 'tropical', 'fruity', 'male'] },
    { type: 'product', name: 'Black Orchid', desc: 'Truffle, orchid, patchouli, vanilla. Luxurious and bold.', price: '6,000LE', link: 'product_e.html', tags: ['perfume', 'oriental', 'floral', 'male'] },
    { type: 'product', name: 'Hawas', desc: 'Citrus, apple, and marine notes. Energetic and masculine.', price: '1,800LE', link: 'product_e.html', tags: ['perfume', 'fresh', 'aquatic', 'male'] },
    { type: 'product', name: 'Delina', desc: 'Lychee, rose, vanilla, musk. Modern and feminine.', price: '7,500LE', link: 'product_e.html', tags: ['perfume', 'citrus', 'female'] },
    { type: 'product', name: 'Amber Oud', desc: 'Rich amber and oud blend. Traditional and elegant.', price: '7,000LE', link: 'product_e.html', tags: ['perfume', 'amber', 'oud', 'oriental'] },
    
    // Pages
    { type: 'page', name: 'Scent Quiz', desc: 'Take our personalized quiz to find your perfect fragrance', link: 'scent_quiz_e.html', icon: '📝', tags: ['quiz', 'personalized', 'match', 'find scent', 'AI'] },
    { type: 'page', name: 'Create Custom Box', desc: 'Build your own personalized perfume sample box', link: 'create_e.html', icon: '🎁', tags: ['custom', 'box', 'samples', 'personalized', 'bottles', 'gifts'] },
    { type: 'page', name: 'Shop All Perfumes', desc: 'Browse our complete collection of luxury fragrances', link: 'product_e.html', icon: '🛍️', tags: ['shop', 'products', 'perfumes', 'buy', 'scents'] },
    { type: 'page', name: 'About Us', desc: 'Learn about Elégancia and our mission', link: 'about_e.html', icon: 'ℹ️', tags: ['about', 'company', 'story', 'mission', 'team'] },
    { type: 'page', name: 'Contact Us', desc: 'Get in touch with our customer service team', link: 'contact_e.html', icon: '📧', tags: ['contact', 'support', 'help', 'email', 'number', 'call'] },
    { type: 'page', name: 'My Profile', desc: 'View and manage your account settings', link: 'profile_e.html', icon: '👤', tags: ['profile', 'account', 'settings', 'user', 'login', 'sign up'] },
    { type: 'page', name: 'Help Center', desc: 'Find answers to frequently asked questions', link: 'help_e.html', icon: '❓', tags: ['help', 'faq', 'support', 'questions'] },
    { type: 'page', name: 'Blogs', desc: 'Read our latest articles about fragrances and trends', link: 'blogs_e.html', icon: '📰', tags: ['blog', 'articles', 'news', 'trends', 'posts'] },
    { type: 'page', name: 'Partners', desc: 'Discover our brand partners and collaborations', link: 'partners_e.html', icon: '🤝', tags: ['partners', 'brands', 'collaborations'] },
    { type: 'page', name: 'Events', desc: 'View upcoming fragrance events and launches', link: 'events_e.html', icon: '🎉', tags: ['events', 'launches', 'exhibitions', 'campaigns', 'booths', 'upcoming', 'past'] },
    
    // Services & Features
    { type: 'feature', name: 'Same-Day Delivery', desc: 'Get your perfumes delivered within hours', link: 'index.html#how', icon: '🚚', tags: ['delivery', 'shipping', 'fast', 'same day', 'how', 'steps'] },
    { type: 'feature', name: 'Try Before You Buy', desc: 'Sample perfumes before committing to full bottles', link: 'index.html#how', icon: '✨', tags: ['samples', 'try', 'test', 'experience'] },
    { type: 'feature', name: 'Personalized Matching', desc: 'AI-powered scent recommendations just for you', link: 'scent_quiz_e.html', icon: '🎯', tags: ['personalized', 'matching', 'ai', 'recommendations'] },
    
    // Customer Service
    { type: 'support', name: 'Returns & Exchanges', desc: 'Easy returns and exchange policy', link: 'returns_e.html', icon: '🔄', tags: ['return', 'exchange', 'refund', 'policy'] },
    { type: 'support', name: 'Privacy Policy', desc: 'How we protect your personal information', link: 'privacy_e.html', icon: '🔒', tags: ['privacy', 'security', 'data', 'protection'] },
    { type: 'support', name: 'Terms of Service', desc: 'Our terms and conditions', link: 'terms_e.html', icon: '📄', tags: ['terms', 'conditions', 'legal'] },
    { type: 'support', name: 'Report Issues', desc: 'Report a problem or concern', link: 'issue_e.html', icon: '⚠️', tags: ['report', 'issue', 'problem', 'complaint'] },
    { type: 'support', name: 'Leave Feedback', desc: 'Share your experience with us', link: 'feedback_e.html', icon: '💬', tags: ['feedback', 'review', 'testimonial', 'rating'] },
    
    // Categories
    { type: 'category', name: 'Floral Perfumes', desc: 'Discover romantic floral fragrances', link: 'product_e.html?category=floral', icon: '🌸', tags: ['floral', 'flowers', 'rose', 'romantic'] },
    { type: 'category', name: 'Woody Perfumes', desc: 'Explore warm woody scents', link: 'product_e.html?category=woody', icon: '🌲', tags: ['woody', 'sandalwood', 'cedar', 'warm'] },
    { type: 'category', name: 'Citrus Perfumes', desc: 'Fresh and zesty citrus fragrances', link: 'product_e.html?category=citrus', icon: '🍋', tags: ['citrus', 'lemon', 'orange', 'fresh'] },
    { type: 'category', name: 'Oriental Perfumes', desc: 'Exotic and spicy oriental scents', link: 'product_e.html?category=oriental', icon: '🌟', tags: ['oriental', 'spicy', 'exotic', 'eastern'] },
    { type: 'category', name: 'Fresh Perfumes', desc: 'Clean and refreshing fragrances', link: 'product_e.html?category=fresh', icon: '💨', tags: ['fresh', 'clean', 'aquatic', 'light'] },
  ];

  // Open search modal
  function openSearch(e) {
    if (e) e.preventDefault();
    searchModal.classList.add('open');
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 400);
  }

  // Close search modal
  function closeSearch() {
    searchModal.classList.remove('open');
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    renderPlaceholder();
  }

  // Render placeholder
  function renderPlaceholder() {
    searchResults.innerHTML = `
      <p class="search-placeholder">Start typing to search products, pages, services, and more...</p>
      <div style="text-align:center; margin-top:20px; color:#888; font-size:14px;">
        <p>💡 Try searching: "quiz", "delivery", "floral", "profile"</p>
      </div>
    `;
  }

  // Get type badge color
  function getTypeBadge(type) {
    const badges = {
      product: { label: 'Product', color: '#D4AF37' },
      page: { label: 'Page', color: '#3b82f6' },
      feature: { label: 'Feature', color: '#10b981' },
      support: { label: 'Support', color: '#8b5cf6' },
      category: { label: 'Category', color: '#f59e0b' }
    };
    const badge = badges[type] || { label: type, color: '#666' };
    return `<span style="background:${badge.color}; color:#fff; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:600; text-transform:uppercase;">${badge.label}</span>`;
  }

  // Render search results
  function renderResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-placeholder">No results found. Try a different search term!</p>';
      return;
    }

    searchResults.innerHTML = results.map(item => `
      <div class="search-result-item" onclick="goToLink('${item.link}')">
        <div style="font-size:32px; margin-right:10px;">${item.icon || '📦'}</div>
        <div class="search-result-info">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
            <div class="search-result-name">${item.name}</div>
            ${getTypeBadge(item.type)}
          </div>
          <div class="search-result-desc">${item.desc}</div>
        </div>
        ${item.price ? `<div class="search-result-price">${item.price}</div>` : '<div style="color:#D4AF37; font-size:20px;">→</div>'}
      </div>
    `).join('');
  }

  // Search function
  function performSearch(query, filterType = null) {
    let results = searchableContent;

    // Filter by type if selected
    if (filterType) {
      results = results.filter(item => {
        if (filterType === 'floral') return item.tags.includes('floral') || item.tags.includes('flowers');
        if (filterType === 'woody') return item.tags.includes('woody');
        if (filterType === 'citrus') return item.tags.includes('citrus');
        if (filterType === 'oriental') return item.tags.includes('oriental');
        if (filterType === 'fresh') return item.tags.includes('fresh');
        return false;
      });
    }

    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.desc.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        item.type.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by relevance (exact matches first)
    if (query) {
      results.sort((a, b) => {
        const aExact = a.name.toLowerCase() === query.toLowerCase();
        const bExact = b.name.toLowerCase() === query.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
      });
    }

    renderResults(results);
  }

  // Navigate to link
  window.goToLink = function(link) {
    window.location.href = link;
  };

  // Event listeners
  if (searchIcon) {
    searchIcon.addEventListener('click', openSearch);
  }

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearch);
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', closeSearch);
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length === 0) {
        renderPlaceholder();
      } else {
        performSearch(query);
      }
    });

    // Enter key to search
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query && searchResults.querySelector('.search-result-item')) {
          // Go to first result
          const firstLink = searchResults.querySelector('.search-result-item').getAttribute('onclick').match(/'([^']+)'/)[1];
          window.location.href = firstLink;
        }
      }
    });
  }

  // Filter chips - now filter by scent type
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.contains('active');
      filterChips.forEach(c => c.classList.remove('active'));
      
      if (!isActive) {
        chip.classList.add('active');
        const filterValue = chip.dataset.filter;
        performSearch(searchInput.value, filterValue);
      } else {
        performSearch(searchInput.value);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      closeSearch();
    }
  });

  // Initialize
  renderPlaceholder();
});