/* SG Farms Product Details Modal Component */
import { i18n } from '../translate.js';
import { DB } from '../db.js';
import { State } from '../state.js';

export const ProductComponent = {
  open(productId) {
    const product = DB.getProductById(productId);
    if (!product) return;

    const lang = State.language;
    const reviews = DB.getReviewsByProductId(productId);
    
    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "No reviews yet";

    // Build Reviews HTML
    const reviewsListHTML = reviews.length > 0 ? reviews.map(r => `
      <div class="review-item-row">
        <div class="review-item-header">
          <strong>${r.user_name}</strong>
          <span class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
          <span class="review-date">${r.date}</span>
        </div>
        <p class="review-comment-text">${r.comment}</p>
      </div>
    `).join('') : `<p class="no-reviews-text">No reviews for this harvest yet. Be the first to review!</p>`;

    // Modal DOM element setup
    let modalOverlay = document.getElementById('product-details-modal');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'product-details-modal';
      modalOverlay.className = 'modal-overlay';
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
      <div class="modal-content product-modal-content">
        <button class="modal-close-btn" id="close-prod-modal" title="Close">
          <i data-lucide="x"></i>
        </button>
        
        <div class="product-modal-grid">
          <!-- Left side image -->
          <div class="product-modal-gallery">
            <img src="${product.images}" alt="${product.crop_name}">
            <div class="gallery-badges">
              <span class="badge ${product.organic ? 'badge-organic' : 'badge-direct'}">
                ${product.organic ? '100% Organic Certified' : 'Direct Harvest'}
              </span>
            </div>
          </div>
          
          <!-- Right side details -->
          <div class="product-modal-details">
            <span class="product-modal-cat">${product.category}</span>
            <h2 class="product-modal-title">${product.crop_name}</h2>
            
            <div class="rating-summary-row">
              <span class="stars-gold">${typeof avgRating === 'number' || !isNaN(avgRating) ? "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating)) : ''}</span>
              <span class="rating-text">(${avgRating} / 5.0 out of ${reviews.length} reviews)</span>
            </div>

            <div class="product-modal-price-row">
              <span class="price-val">₹${product.price}</span>
              <span class="price-unit">per ${product.unit}</span>
            </div>

            <div class="farm-meta-grid">
              <div class="farm-meta-item">
                <i data-lucide="calendar"></i>
                <div>
                  <strong>Estimated Harvest</strong>
                  <span>${product.harvest_date}</span>
                </div>
              </div>
              <div class="farm-meta-item">
                <i data-lucide="truck"></i>
                <div>
                  <strong>Delivery Time</strong>
                  <span>${product.delivery_time}</span>
                </div>
              </div>
              <div class="farm-meta-item">
                <i data-lucide="database"></i>
                <div>
                  <strong>Available Stock</strong>
                  <span>${product.stock} ${product.unit}</span>
                </div>
              </div>
            </div>

            <p class="product-modal-description">${product.description}</p>

            <div class="product-modal-action-row">
              <div class="qty-selector-container">
                <button class="qty-btn" id="prod-modal-qty-dec">-</button>
                <span class="qty-val" id="prod-modal-qty-val">1</span>
                <button class="qty-btn" id="prod-modal-qty-inc">+</button>
              </div>
              <button class="btn btn-primary" id="prod-modal-add-cart">
                <i data-lucide="shopping-cart"></i> ${i18n.t('btn_add_cart', lang)}
              </button>
              <button class="btn btn-secondary" id="prod-modal-whatsapp" title="Order directly on WhatsApp">
                <i data-lucide="phone-call"></i> WhatsApp
              </button>
            </div>
          </div>
        </div>

        <hr class="modal-divider">

        <!-- Reviews section -->
        <div class="product-modal-reviews-section">
          <h3>${i18n.t('review_title', lang)}</h3>
          <div class="reviews-split-layout">
            <!-- Review display -->
            <div class="reviews-list-container">
              ${reviewsListHTML}
            </div>

            <!-- Review write form -->
            <div class="review-form-container">
              <h4>${i18n.t('review_add', lang)}</h4>
              <form id="add-review-form">
                <div class="form-group">
                  <label for="review-form-username">${i18n.t('review_name', lang)}</label>
                  <input type="text" id="review-form-username" class="form-control" required value="${State.user ? State.user.name : ''}">
                </div>
                <div class="form-group">
                  <label>${i18n.t('review_rating', lang)}</label>
                  <div class="star-rating interactive-stars" id="interactive-star-container">
                    <i data-lucide="star" class="star-node" data-index="1"></i>
                    <i data-lucide="star" class="star-node" data-index="2"></i>
                    <i data-lucide="star" class="star-node" data-index="3"></i>
                    <i data-lucide="star" class="star-node" data-index="4"></i>
                    <i data-lucide="star" class="star-node" data-index="5"></i>
                  </div>
                  <input type="hidden" id="review-form-rating" value="5">
                </div>
                <div class="form-group">
                  <label for="review-form-comment">${i18n.t('review_comment', lang)}</label>
                  <textarea id="review-form-comment" class="form-control" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-sm">${i18n.t('review_submit', lang)}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    modalOverlay.classList.add('show');

    this.attachEvents(modalOverlay, product);
  },

  attachEvents(modal, product) {
    let currentQty = 1;
    const qtyVal = modal.querySelector('#prod-modal-qty-val');
    const starNodes = modal.querySelectorAll('.star-node');
    const ratingInput = modal.querySelector('#review-form-rating');

    // Close buttons
    modal.querySelector('#close-prod-modal').addEventListener('click', () => {
      modal.classList.remove('show');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });

    // Quantity Inc/Dec
    modal.querySelector('#prod-modal-qty-dec').addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyVal.textContent = currentQty;
      }
    });
    modal.querySelector('#prod-modal-qty-inc').addEventListener('click', () => {
      if (currentQty < product.stock) {
        currentQty++;
        qtyVal.textContent = currentQty;
      }
    });

    // Add to Cart in modal
    modal.querySelector('#prod-modal-add-cart').addEventListener('click', () => {
      State.addToCart(product, currentQty);
      const addBtn = modal.querySelector('#prod-modal-add-cart');
      addBtn.innerHTML = `<i data-lucide="check"></i> Added!`;
      lucide.createIcons();
      setTimeout(() => {
        addBtn.innerHTML = `<i data-lucide="shopping-cart"></i> ${i18n.t('btn_add_cart', State.language)}`;
        lucide.createIcons();
        modal.classList.remove('show');
      }, 1000);
    });

    // WhatsApp Direct Order button
    modal.querySelector('#prod-modal-whatsapp').addEventListener('click', () => {
      const message = `Hello Farmer Sures, I want to order ${currentQty} ${product.unit} of your fresh organic ${product.crop_name} (Price: ₹${product.price}/${product.unit}). Please deliver to my address in Andhra Pradesh.`;
      const url = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });

    // Interactive Star Rating selectors
    starNodes.forEach((star, index) => {
      // Set default high (5 stars)
      if (index < 5) {
        star.classList.add('star-filled');
        star.setAttribute('fill', 'gold');
        star.setAttribute('color', 'gold');
      }

      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-index'));
        ratingInput.value = rating;
        
        starNodes.forEach((s, idx) => {
          if (idx < rating) {
            s.classList.add('star-filled');
            s.setAttribute('fill', 'gold');
            s.setAttribute('color', 'gold');
          } else {
            s.classList.remove('star-filled');
            s.removeAttribute('fill');
            s.setAttribute('color', 'currentColor');
          }
        });
        lucide.createIcons();
      });
    });

    // Add Review Form submit
    modal.querySelector('#add-review-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const user_name = modal.querySelector('#review-form-username').value;
      const comment = modal.querySelector('#review-form-comment').value;
      const rating = parseInt(ratingInput.value);

      DB.addReview({
        product_id: product.id,
        user_name,
        comment,
        rating
      });

      // Show success, reload reviews in modal
      alert("Thank you for your feedback! Review submitted.");
      this.open(product.id);
    });
  }
};
