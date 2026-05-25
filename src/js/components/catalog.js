/* SG Farms Crop Catalog Component */
import { i18n } from '../translate.js';
import { DB } from '../db.js';
import { State } from '../state.js';

export const CatalogComponent = {
  activeCategory: 'all',
  activeSearch: '',
  activeSort: 'featured',
  organicOnly: false,

  render(container) {
    const lang = State.language;
    const allProducts = DB.getProducts();

    // Filter products
    let products = allProducts.filter(p => {
      // Category filter
      if (this.activeCategory !== 'all' && p.category.toLowerCase() !== this.activeCategory) {
        return false;
      }
      // Organic filter
      if (this.organicOnly && !p.organic) {
        return false;
      }
      // Search filter
      if (this.activeSearch) {
        const query = this.activeSearch.toLowerCase();
        return p.crop_name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      }
      return true;
    });

    // Sort products
    if (this.activeSort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (this.activeSort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (this.activeSort === 'name') {
      products.sort((a, b) => a.crop_name.localeCompare(b.crop_name));
    }

    // Build Catalog Grid HTML
    const gridHTML = products.length > 0 ? products.map(p => {
      const isWish = State.isInWishlist(p.id);
      return `
        <div class="crop-card">
          <div class="crop-img-container">
            <img src="${p.images}" alt="${p.crop_name}" class="crop-card-img">
            <span class="crop-category-badge">${p.category}</span>
            ${p.organic ? `<span class="organic-ribbon">${i18n.t('organic_badge', lang)}</span>` : ''}
            <button class="wishlist-toggle-heart ${isWish ? 'active' : ''}" data-id="${p.id}" title="Toggle Wishlist">
              <i data-lucide="heart" ${isWish ? 'fill="red" color="red"' : ''}></i>
            </button>
          </div>
          <div class="crop-card-body">
            <h3 class="crop-card-title">${p.crop_name}</h3>
            <p class="crop-card-desc">${p.description.substring(0, 90)}...</p>
            <div class="crop-card-meta">
              <span class="crop-price">₹${p.price}/${p.unit}</span>
              <span class="crop-stock ${p.stock < 100 ? 'low-stock' : ''}">${p.stock} ${p.unit} left</span>
            </div>
            <div class="crop-card-actions">
              <button class="btn btn-secondary btn-sm view-product-details" data-id="${p.id}">
                <i data-lucide="eye"></i> Info
              </button>
              <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${p.id}">
                <i data-lucide="shopping-cart"></i> ${i18n.t('btn_add_cart', lang)}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('') : `
      <div class="no-products-found">
        <i data-lucide="search-code"></i>
        <h3>No crops match your filters</h3>
        <p>Try clearing your search query or choosing another category.</p>
        <button class="btn btn-primary btn-sm" id="reset-catalog-filters">Reset All Filters</button>
      </div>
    `;

    container.innerHTML = `
      <div class="catalog-page-container container section-padding">
        <div class="catalog-header-banner">
          <h2>${i18n.t('nav_shop', lang)}</h2>
          <p>Freshly harvested organic grains, seasonal fruits, and vegetables direct from Mukkollu farmers.</p>
        </div>

        <div class="catalog-layout">
          <!-- Left Sidebar Filters -->
          <aside class="catalog-filters-sidebar">
            <div class="filter-section">
              <h4>${i18n.t('search_placeholder', lang).split('...')[0]}</h4>
              <div class="search-box-container">
                <input type="text" id="catalog-search-input" value="${this.activeSearch}" placeholder="${i18n.t('search_placeholder', lang)}">
                <i data-lucide="search" class="search-icon"></i>
              </div>
            </div>

            <div class="filter-section">
              <h4>${i18n.t('filter_category', lang)}</h4>
              <div class="filter-categories-list">
                <button class="filter-cat-btn ${this.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
                  ${i18n.t('filter_all', lang)}
                </button>
                <button class="filter-cat-btn ${this.activeCategory === 'fruits' ? 'active' : ''}" data-cat="fruits">
                  ${i18n.t('filter_fruits', lang)}
                </button>
                <button class="filter-cat-btn ${this.activeCategory === 'vegetables' ? 'active' : ''}" data-cat="vegetables">
                  ${i18n.t('filter_veggies', lang)}
                </button>
                <button class="filter-cat-btn ${this.activeCategory === 'grains' ? 'active' : ''}" data-cat="grains">
                  ${i18n.t('filter_grains', lang)}
                </button>
                <button class="filter-cat-btn ${this.activeCategory === 'herbs' ? 'active' : ''}" data-cat="herbs">
                  ${i18n.t('filter_herbs', lang)}
                </button>
              </div>
            </div>

            <div class="filter-section">
              <h4>Farming Type</h4>
              <label class="toggle-checkbox-label">
                <input type="checkbox" id="organic-filter-toggle" ${this.organicOnly ? 'checked' : ''}>
                <span class="custom-checkbox"></span>
                <span>Organic Certified Only</span>
              </label>
            </div>
          </aside>

          <!-- Right Grid Area -->
          <div class="catalog-main-content">
            <div class="catalog-toolbar">
              <span class="toolbar-results">${products.length} Crops Found</span>
              <div class="toolbar-sort">
                <label for="catalog-sort-select">${i18n.t('sort_by', lang)}:</label>
                <select id="catalog-sort-select">
                  <option value="featured" ${this.activeSort === 'featured' ? 'selected' : ''}>${i18n.t('sort_featured', lang)}</option>
                  <option value="price-low" ${this.activeSort === 'price-low' ? 'selected' : ''}>${i18n.t('sort_price_low', lang)}</option>
                  <option value="price-high" ${this.activeSort === 'price-high' ? 'selected' : ''}>${i18n.t('sort_price_high', lang)}</option>
                  <option value="name" ${this.activeSort === 'name' ? 'selected' : ''}>Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-3 catalog-grid">
              ${gridHTML}
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.attachEvents(container);
  },

  attachEvents(container) {
    // Search input handler
    const searchInput = container.querySelector('#catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.activeSearch = e.target.value;
        // Debounce redrawing
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(() => {
          this.render(container);
          // Maintain focus
          const input = container.querySelector('#catalog-search-input');
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }, 300);
      });
    }

    // Category button handlers
    container.querySelectorAll('.filter-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.getAttribute('data-cat');
        this.render(container);
      });
    });

    // Organic filter handler
    const organicToggle = container.querySelector('#organic-filter-toggle');
    if (organicToggle) {
      organicToggle.addEventListener('change', (e) => {
        this.organicOnly = e.target.checked;
        this.render(container);
      });
    }

    // Sort select handler
    const sortSelect = container.querySelector('#catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.activeSort = e.target.value;
        this.render(container);
      });
    }

    // Wishlist Toggle
    container.querySelectorAll('.wishlist-toggle-heart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        State.toggleWishlist(id);
        
        // Quick visual updates
        const isWish = State.isInWishlist(id);
        if (isWish) {
          btn.classList.add('active');
          btn.querySelector('i').setAttribute('fill', 'red');
          btn.querySelector('i').setAttribute('color', 'red');
        } else {
          btn.classList.remove('active');
          btn.querySelector('i').removeAttribute('fill');
          btn.querySelector('i').setAttribute('color', 'currentColor');
        }
        lucide.createIcons();
      });
    });

    // Add to Cart
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const p = DB.getProductById(id);
        if (p) {
          State.addToCart(p, 1);
          btn.innerHTML = `<i data-lucide="check"></i> Added!`;
          lucide.createIcons();
          setTimeout(() => {
            btn.innerHTML = `<i data-lucide="shopping-cart"></i> ${i18n.t('btn_add_cart', State.language)}`;
            lucide.createIcons();
          }, 1200);
        }
      });
    });

    // View Details modal
    container.querySelectorAll('.view-product-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        window.dispatchEvent(new CustomEvent('openProductDetails', { detail: id }));
      });
    });

    // Reset Filters button
    const resetBtn = container.querySelector('#reset-catalog-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.activeCategory = 'all';
        this.activeSearch = '';
        this.activeSort = 'featured';
        this.organicOnly = false;
        this.render(container);
      });
    }
  }
};
