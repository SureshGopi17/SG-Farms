/* SG Farms Homepage Component */
import { i18n } from '../translate.js';
import { DB } from '../db.js';
import { WeatherEngine } from '../weather.js';
import { State } from '../state.js';

export const HomeComponent = {
  render(container) {
    const lang = State.language;
    const products = DB.getProducts();
    const weatherData = WeatherEngine.getLiveWeather();
    
    // Get Summer Recommendations
    const recommendations = WeatherEngine.getRecommendations(products);

    // Build Featured Crops HTML (Limit to 3 items)
    const featuredHTML = products.slice(0, 3).map(p => `
      <div class="crop-card card-glow">
        <div class="crop-img-container">
          <img src="${p.images}" alt="${p.crop_name}" class="crop-card-img">
          <span class="crop-category-badge">${p.category}</span>
          ${p.organic ? `<span class="organic-ribbon">${i18n.t('organic_badge', lang)}</span>` : ''}
        </div>
        <div class="crop-card-body">
          <h3 class="crop-card-title">${p.crop_name}</h3>
          <p class="crop-card-desc">${p.description.substring(0, 80)}...</p>
          <div class="crop-card-meta">
            <span class="crop-price">₹${p.price}/${p.unit}</span>
            <span class="crop-stock ${p.stock < 100 ? 'low-stock' : ''}">${i18n.t('stock_available', lang)}: ${p.stock} ${p.unit}</span>
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
    `).join('');

    // Recommends slide layout
    const recommendCardsHTML = recommendations.items.map(p => `
      <div class="recommend-item" data-id="${p.id}">
        <img src="${p.images}" alt="${p.crop_name}">
        <div>
          <h5>${p.crop_name}</h5>
          <span>₹${p.price}/${p.unit} - ${p.organic ? 'Organic' : 'Regular'}</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-bg-overlay"></div>
        <div class="container hero-content">
          <span class="hero-badge">🌾 Direct from Mukkollu Fields</span>
          <h1>${i18n.t('hero_title', lang)}</h1>
          <p>${i18n.t('hero_subtitle', lang)}</p>
          <div class="hero-buttons">
            <a href="/catalog" class="btn btn-primary btn-lg spa-route-btn">${i18n.t('btn_shop', lang)}</a>
            <a href="/farm" class="btn btn-secondary btn-lg spa-route-btn">${i18n.t('btn_explore', lang)}</a>
          </div>
        </div>
      </section>

      <section class="container section-padding">
        <div class="grid grid-2 recommendation-weather-row">
          <!-- Weather Simulator Widget -->
          <div class="weather-widget">
            <div class="weather-header">
              <div class="weather-title">
                <i data-lucide="cloud-sun" class="weather-icon-sun"></i>
                <div>
                  <h4>${i18n.t('weather_widget_title', lang)}</h4>
                  <span>Live Harvest Station</span>
                </div>
              </div>
              <div class="weather-temp">${weatherData.temp}°C</div>
            </div>
            
            <div class="weather-body">
              <div class="weather-meta">
                <div class="weather-meta-item">
                  <i data-lucide="droplet"></i>
                  <span>Humidity: ${weatherData.humidity}%</span>
                </div>
                <div class="weather-meta-item">
                  <i data-lucide="wind"></i>
                  <span>Wind: ${weatherData.windSpeed} km/h</span>
                </div>
                <div class="weather-meta-item">
                  <i data-lucide="calendar-days"></i>
                  <span>Season: ${weatherData.seasonName}</span>
                </div>
              </div>
              <div class="weather-alert">
                <i data-lucide="info"></i>
                <p><strong>Farmer's Log:</strong> ${weatherData.advice}</p>
              </div>
            </div>
          </div>

          <!-- AI Crop Recommendation Widget -->
          <div class="ai-recommend-widget">
            <div class="widget-header">
              <span class="sparkle-icon">✨</span>
              <h4>${i18n.t('recommendation_title', lang)}</h4>
            </div>
            <p>${i18n.t('recommendation_desc', lang)}</p>
            <div class="recommend-list">
              ${recommendCardsHTML}
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Crops Grid -->
      <section class="featured-crops-section section-padding">
        <div class="container">
          <div class="section-header text-center">
            <h2>${i18n.t('featured_crops', lang)}</h2>
            <p>${i18n.t('featured_crops_desc', lang)}</p>
          </div>
          
          <div class="grid grid-3 featured-grid-list">
            ${featuredHTML}
          </div>
          
          <div class="text-center view-all-btn-row">
            <a href="/catalog" class="btn btn-secondary spa-route-btn">View All Crop Fields</a>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="why-us-section section-padding">
        <div class="container">
          <div class="section-header text-center">
            <h2>${i18n.t('why_title', lang)}</h2>
            <p>${i18n.t('why_desc', lang)}</p>
          </div>
          
          <div class="grid grid-3">
            <div class="why-card">
              <div class="why-icon">🌿</div>
              <h3>${i18n.t('why_1_title', lang)}</h3>
              <p>${i18n.t('why_1_desc', lang)}</p>
            </div>
            
            <div class="why-card">
              <div class="why-icon">🚚</div>
              <h3>${i18n.t('why_2_title', lang)}</h3>
              <p>${i18n.t('why_2_desc', lang)}</p>
            </div>
            
            <div class="why-card">
              <div class="why-icon">👨‍🌾</div>
              <h3>${i18n.t('why_3_title', lang)}</h3>
              <p>${i18n.t('why_3_desc', lang)}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials-section section-padding">
        <div class="container">
          <div class="section-header text-center">
            <h2>What Our Customers Say</h2>
            <p>Read real experiences of organic lovers across Andhra Pradesh.</p>
          </div>
          
          <div class="grid grid-3">
            <div class="testimonial-card">
              <div class="stars">★★★★★</div>
              <p>"The Banganapalli mangoes were directly delivered in Vizag. They ripened naturally and had that rich, traditional sweetness I haven't tasted since childhood!"</p>
              <div class="reviewer-info">
                <strong>Ramesh Chandra</strong>
                <span>Visakhapatnam</span>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="stars">★★★★★</div>
              <p>"Excellent quality country tomatoes. They were so fresh, they smelled like the soil of Mukkollu village. Highly recommended for daily cooking."</p>
              <div class="reviewer-info">
                <strong>Anitha Reddy</strong>
                <span>Vijayawada</span>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="stars">★★★★☆</div>
              <p>"Superb HMT rice. I ordered a 25kg bag. The grains cook very fluffy. Very transparent delivery tracking, the farmer updated me on WhatsApp."</p>
              <div class="reviewer-info">
                <strong>Suresh Kumar</strong>
                <span>Guntur</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Initialize icons
    lucide.createIcons();

    // Attach Event Listeners
    this.attachEvents(container);
  },

  attachEvents(container) {
    // Add to Cart Buttons
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const p = DB.getProductById(id);
        if (p) {
          State.addToCart(p, 1);
          // Show quick alert
          btn.innerHTML = `<i data-lucide="check"></i> Added!`;
          lucide.createIcons();
          setTimeout(() => {
            btn.innerHTML = `<i data-lucide="shopping-cart"></i> ${i18n.t('btn_add_cart', State.language)}`;
            lucide.createIcons();
          }, 1500);
        }
      });
    });

    // View Product details
    container.querySelectorAll('.view-product-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        window.dispatchEvent(new CustomEvent('openProductDetails', { detail: id }));
      });
    });

    // Click recommendations to view
    container.querySelectorAll('.recommend-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const id = item.getAttribute('data-id');
        window.dispatchEvent(new CustomEvent('openProductDetails', { detail: id }));
      });
    });
  }
};
