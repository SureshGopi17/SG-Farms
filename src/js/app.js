/* SG Farms SPA Router and Orchestrator */
import { DB } from './db.js';
import { State } from './state.js';
import { i18n } from './translate.js';
import { WeatherEngine } from './weather.js';
import { ChatbotEngine } from './chatbot.js';

// Import UI Components
import { HomeComponent } from './components/home.js';
import { CatalogComponent } from './components/catalog.js';
import { FarmComponent } from './components/farm.js';
import { BlogComponent } from './components/blog.js';
import { CustomerComponent } from './components/customer.js';
import { AdminComponent } from './components/admin.js';
import { CartComponent } from './components/cart.js';
import { ProductComponent } from './components/product.js';

const App = {
  rootEl: null,

  init() {
    this.rootEl = document.getElementById('app-root');
    if (!this.rootEl) return;

    // 1. Initialize databases and state
    DB.init();
    State.init();

    // 2. Setup routing listeners
    this.setupRouting();

    // 3. Setup global overlays
    this.setupCartDrawer();
    this.setupLanguageSelector();
    this.setupAuthObserver();
    this.setupChatbot();

    // 4. Initial layout refresh
    this.refreshUserMenu();
    CartComponent.updateCartDrawer();
    this.updateWishlistCount();

    // 5. Run first route
    this.router();
  },

  // History-based router mapping
  router() {
    const path = window.location.pathname;
    
    // Clear editing state when shifting routes
    AdminComponent.editingProduct = null;
    
    // Update Nav bar highlights
    this.updateNavLinks(path);

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Route matching
    if (path === '/' || path === '/home' || path === '') {
      HomeComponent.render(this.rootEl);
    } else if (path === '/catalog') {
      CatalogComponent.render(this.rootEl);
    } else if (path === '/farm') {
      FarmComponent.render(this.rootEl);
    } else if (path === '/blog') {
      BlogComponent.render(this.rootEl);
    } else if (path === '/customer') {
      CustomerComponent.render(this.rootEl);
    } else if (path === '/admin') {
      AdminComponent.render(this.rootEl);
    } else if (path === '/checkout') {
      CartComponent.render(this.rootEl);
    } else {
      // Fallback 404
      this.rootEl.innerHTML = `
        <div class="container section-padding text-center">
          <h2>404 Page Not Found</h2>
          <p>We couldn't harvest the page you are looking for.</p>
          <a href="/" class="btn btn-primary spa-route-btn" style="margin-top: 20px;">Go Home</a>
        </div>
      `;
      lucide.createIcons();
    }
  },

  setupRouting() {
    // Intercept clicking links for SPA routing
    document.body.addEventListener('click', (e) => {
      // Traverse up to find if clicked element is an <a> tag with class spa-route-btn or inside navbar/footer
      let target = e.target;
      while (target && target !== document.body) {
        if (target.tagName === 'A' && (
          target.classList.contains('spa-route-btn') || 
          target.classList.contains('nav-link') || 
          target.classList.contains('logo') ||
          target.classList.contains('footer-nav-link') ||
          target.classList.contains('footer-link')
        )) {
          e.preventDefault();
          const href = target.getAttribute('href');
          if (href) {
            window.history.pushState({}, "", href);
            this.router();
          }
          break;
        }
        target = target.parentNode;
      }
    });

    // Handle back/forward actions
    window.addEventListener('popstate', () => {
      this.router();
    });

    // Custom events
    window.addEventListener('openProductDetails', (e) => {
      const productId = e.detail;
      ProductComponent.open(productId);
    });
  },

  updateNavLinks(path) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Collapse mobile menu on route change
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.remove('show');
  },

  // Setup Shopping Cart Overlay & Drawer callbacks
  setupCartDrawer() {
    const trigger = document.getElementById('cart-trigger-btn');
    const closeBtn = document.getElementById('cart-drawer-close');
    const overlay = document.getElementById('cart-drawer-overlay');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (trigger) {
      trigger.addEventListener('click', () => {
        CartComponent.openDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        CartComponent.closeDrawer();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        CartComponent.closeDrawer();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        CartComponent.closeDrawer();
        window.history.pushState({}, "", "/checkout");
        this.router();
      });
    }

    // State observer triggers
    window.addEventListener('cartUpdated', () => {
      CartComponent.updateCartDrawer();
    });
  },

  // Language selectors
  setupLanguageSelector() {
    const langBtn = document.getElementById('lang-menu-btn');
    const dropdown = document.getElementById('lang-dropdown');

    if (langBtn && dropdown) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('show');
      });

      dropdown.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const lang = opt.getAttribute('data-lang');
          State.setLanguage(lang);
        });
      });
    }

    window.addEventListener('languageChanged', () => {
      // Update code flag representation
      const currentCodeEl = document.getElementById('current-lang-code');
      if (currentCodeEl) {
        currentCodeEl.textContent = State.language.toUpperCase();
      }

      // Re-translate standard statically loaded header/footer elements
      this.retranslateShell();

      // Refresh active page viewport in new language
      this.router();
    });
  },

  retranslateShell() {
    const lang = State.language;
    
    // Navbar
    const navHome = document.getElementById('nav-link-home');
    const navCatalog = document.getElementById('nav-link-catalog');
    const navFarm = document.getElementById('nav-link-farm');
    const navBlog = document.getElementById('nav-link-blog');
    
    if (navHome) navHome.textContent = i18n.t('nav_home', lang);
    if (navCatalog) navCatalog.textContent = i18n.t('nav_shop', lang);
    if (navFarm) navFarm.textContent = i18n.t('nav_logs', lang);
    if (navBlog) navBlog.textContent = i18n.t('nav_blog', lang);

    // Chatbot suggestion buttons
    this.refreshChatbotSuggestions();
  },

  // Watch Authentication status and redraw profile menus
  setupAuthObserver() {
    window.addEventListener('authChanged', () => {
      this.refreshUserMenu();
      
      // If logged out on /admin or /customer, sync route
      const path = window.location.pathname;
      if (!State.user && (path === '/admin' || path === '/customer')) {
        this.router();
      }
    });

    window.addEventListener('wishlistUpdated', () => {
      this.updateWishlistCount();
    });

    // Mobile Menu burger trigger
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('show');
      });
    }
  },

  refreshUserMenu() {
    const container = document.getElementById('user-menu-container');
    if (!container) return;

    if (!State.user) {
      container.innerHTML = `
        <a href="/customer" class="btn btn-primary btn-sm spa-route-btn" style="padding: 8px 16px;">
          <i data-lucide="user"></i> Log In
        </a>
      `;
    } else {
      const initials = State.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      container.innerHTML = `
        <button class="user-profile-btn" id="user-dropdown-trigger">
          <span class="user-avatar-text">${initials}</span>
          <span class="user-name">${State.user.name.split(' ')[0]}</span>
        </button>
        <div class="user-dropdown" id="user-dropdown-menu">
          <div class="user-dropdown-header">
            <strong>${State.user.name}</strong>
            <div class="dropdown-email">${State.user.email}</div>
          </div>
          ${State.user.role === 'admin' ? `
            <a href="/admin" class="user-dropdown-option spa-route-btn"><i data-lucide="settings"></i> Admin Control</a>
          ` : `
            <a href="/customer" class="user-dropdown-option spa-route-btn"><i data-lucide="layout-dashboard"></i> My Dashboard</a>
          `}
          <button class="user-dropdown-option logout-option" id="user-menu-logout"><i data-lucide="log-out"></i> Log Out</button>
        </div>
      `;

      // Setup dropdown toggle click handlers
      const trigger = container.querySelector('#user-dropdown-trigger');
      const menu = container.querySelector('#user-dropdown-menu');
      const logoutBtn = container.querySelector('#user-menu-logout');

      if (trigger && menu) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
          menu.classList.remove('show');
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          State.logout();
        });
      }
    }
    lucide.createIcons();
  },

  updateWishlistCount() {
    const wishCountEl = document.getElementById('wishlist-count');
    if (wishCountEl) {
      const count = State.wishlist.length;
      wishCountEl.textContent = count;
      if (count > 0) {
        wishCountEl.classList.remove('badge-hidden');
      } else {
        wishCountEl.classList.add('badge-hidden');
      }
    }
  },

  // Setup AI Chatbot Interface Panel & Input submissions
  setupChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPanel = document.getElementById('chatbot-panel');
    const chatOpenIcon = chatbotToggle.querySelector('.chat-open-icon');
    const chatCloseIcon = chatbotToggle.querySelector('.chat-close-icon');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');

    // Toggle panel
    chatbotToggle.addEventListener('click', () => {
      chatbotPanel.classList.toggle('show');
      chatOpenIcon.classList.toggle('hidden');
      chatCloseIcon.classList.toggle('hidden');
      
      // Auto welcome if messages empty
      if (messagesContainer.children.length === 0) {
        this.addBotMessage(i18n.t('chatbot_welcome', State.language));
        this.refreshChatbotSuggestions();
      }
    });

    // Chatbot Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;

      // Add user message
      this.addUserMessage(message);
      input.value = '';

      // Simulate typing & respond
      this.simulateBotResponse(message);
    });
  },

  addUserMessage(text) {
    const container = document.getElementById('chatbot-messages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg outgoing';
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  },

  addBotMessage(text) {
    const container = document.getElementById('chatbot-messages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg incoming';
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  },

  simulateBotResponse(query) {
    // Add temporary loading indicator
    const container = document.getElementById('chatbot-messages');
    const typing = document.createElement('div');
    typing.className = 'chat-msg incoming bot-typing';
    typing.innerHTML = `<span class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></span> Farmer Sures typing...`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const answer = ChatbotEngine.getResponse(query);
      this.addBotMessage(answer);
    }, 700);
  },

  refreshChatbotSuggestions() {
    const container = document.getElementById('chatbot-suggestions');
    if (!container) return;

    const lang = State.language;
    const suggestions = [
      i18n.t('chatbot_suggest_1', lang),
      i18n.t('chatbot_suggest_2', lang),
      i18n.t('chatbot_suggest_3', lang),
      i18n.t('chatbot_suggest_4', lang)
    ];

    container.innerHTML = suggestions.map(s => `
      <span class="suggest-pill">${s}</span>
    `).join('');

    // Attach click listeners to suggestions
    container.querySelectorAll('.suggest-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const txt = pill.textContent;
        this.addUserMessage(txt);
        this.simulateBotResponse(txt);
      });
    });
  }
};

// Start application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
