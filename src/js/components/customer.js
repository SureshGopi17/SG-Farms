/* SG Farms Customer Portal (Authentication and Dashboard) */
import { i18n } from '../translate.js';
import { DB } from '../db.js';
import { State } from '../state.js';

export const CustomerComponent = {
  activeTab: 'orders', // orders, wishlist, loyalty, profile
  activeAuthTab: 'login', // login, register

  render(container) {
    if (!State.user) {
      this.renderAuth(container);
    } else {
      this.renderDashboard(container);
    }
  },

  // 1. Authentication Screens (Login / Signup)
  renderAuth(container) {
    container.innerHTML = `
      <div class="container section-padding" style="display: flex; align-items: center; justify-content: center; min-height: 70vh;">
        <div class="auth-card" style="background-color: var(--bg-white); max-width: 480px; width: 100%; padding: 40px; border-radius: var(--radius-lg); border: 1px solid var(--border-light); box-shadow: var(--shadow-lg);">
          
          <!-- Auth tab header -->
          <div class="auth-tabs" style="display: flex; border-bottom: 2px solid var(--bg-cream); margin-bottom: 30px;">
            <button class="auth-tab-btn ${this.activeAuthTab === 'login' ? 'active' : ''}" id="auth-tab-login" style="flex: 1; text-align: center; padding: 12px; font-family: var(--font-heading); font-weight: 700; border-bottom: 3px solid ${this.activeAuthTab === 'login' ? 'var(--primary)' : 'transparent'}; cursor: pointer;">
              Login
            </button>
            <button class="auth-tab-btn ${this.activeAuthTab === 'register' ? 'active' : ''}" id="auth-tab-register" style="flex: 1; text-align: center; padding: 12px; font-family: var(--font-heading); font-weight: 700; border-bottom: 3px solid ${this.activeAuthTab === 'register' ? 'var(--primary)' : 'transparent'}; cursor: pointer;">
              Register
            </button>
          </div>

          <!-- Dynamic forms -->
          ${this.activeAuthTab === 'login' ? `
            <form id="auth-login-form">
              <h3 style="margin-bottom: 20px; font-family: var(--font-heading);">Sign In to SG Farms</h3>
              
              <div class="form-group">
                <label for="login-email">Email Address</label>
                <input type="email" id="login-email" class="form-control" placeholder="customer@farm.com" required>
              </div>

              <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" class="form-control" placeholder="Enter password (demo: user123)" required>
              </div>

              <label class="toggle-checkbox-label" style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px; font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="login-remember">
                <span class="custom-checkbox"></span>
                <span>Keep me signed in</span>
              </label>

              <button type="submit" class="btn btn-primary btn-block">
                Sign In
              </button>
            </form>
          ` : `
            <form id="auth-register-form">
              <h3 style="margin-bottom: 20px; font-family: var(--font-heading);">Create Customer Account</h3>
              
              <div class="form-group">
                <label for="reg-name">Full Name</label>
                <input type="text" id="reg-name" class="form-control" placeholder="e.g. Anand Sharma" required>
              </div>

              <div class="form-group">
                <label for="reg-email">Email Address</label>
                <input type="email" id="reg-email" class="form-control" placeholder="anand@email.com" required>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="reg-password">Password</label>
                  <input type="password" id="reg-password" class="form-control" placeholder="Min 6 characters" required minlength="6">
                </div>
                <div class="form-group">
                  <label for="reg-phone">Phone (+91)</label>
                  <input type="tel" id="reg-phone" class="form-control" placeholder="10-digit mobile" pattern="[6789][0-9]{9}" required>
                </div>
              </div>

              <div class="form-group">
                <label for="reg-address">Delivery Address (AP Hubs)</label>
                <textarea id="reg-address" class="form-control" rows="2" placeholder="Street name, City, Andhra Pradesh" required></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block">
                Create Account
              </button>
            </form>
          `}

        </div>
      </div>
    `;

    this.attachAuthEvents(container);
  },

  attachAuthEvents(container) {
    // Tabs toggle
    const tabLogin = container.querySelector('#auth-tab-login');
    const tabReg = container.querySelector('#auth-tab-register');

    if (tabLogin) {
      tabLogin.addEventListener('click', () => {
        this.activeAuthTab = 'login';
        this.render(container);
      });
    }
    if (tabReg) {
      tabReg.addEventListener('click', () => {
        this.activeAuthTab = 'register';
        this.render(container);
      });
    }

    // Login Form Submit
    const loginForm = container.querySelector('#auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = container.querySelector('#login-email').value;
        const password = container.querySelector('#login-password').value;
        const remember = container.querySelector('#login-remember').checked;

        const user = DB.getUserByEmail(email);
        if (user && user.password === password) {
          State.login(user, remember);
          // If admin, we should redirect to admin section or notify router
          if (user.role === 'admin') {
            window.history.pushState({}, "", "/admin");
            window.dispatchEvent(new CustomEvent('popstate'));
          } else {
            this.render(container);
          }
        } else {
          alert("Invalid email or password. Please use default credentials shown below.");
        }
      });
    }

    // Register Form Submit
    const regForm = container.querySelector('#auth-register-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#reg-name').value;
        const email = container.querySelector('#reg-email').value;
        const password = container.querySelector('#reg-password').value;
        const phone = container.querySelector('#reg-phone').value;
        const address = container.querySelector('#reg-address').value;

        try {
          const registered = DB.registerUser({ name, email, password, phone, address });
          State.login(registered, false);
          this.render(container);
        } catch (err) {
          alert(err.message);
        }
      });
    }
  },

  // 2. Customer Dashboard Screens
  renderDashboard(container) {
    const user = State.user;
    
    container.innerHTML = `
      <div class="container section-padding">
        <div class="dashboard-header-row">
          <div>
            <h2 style="font-family: var(--font-heading);">Customer Dashboard</h2>
            <p>Welcome back, <span class="accent-text" style="font-weight: 700;">${user.name}</span>!</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="dashboard-logout-btn">
            <i data-lucide="log-out"></i> Log Out
          </button>
        </div>

        <div class="dashboard-grid">
          <!-- Sidebar Nav -->
          <aside class="dashboard-sidebar">
            <div class="dashboard-nav-item ${this.activeTab === 'orders' ? 'active' : ''}" data-tab="orders">
              <i data-lucide="package"></i> Order History
            </div>
            <div class="dashboard-nav-item ${this.activeTab === 'wishlist' ? 'active' : ''}" data-tab="wishlist">
              <i data-lucide="heart"></i> My Wishlist
            </div>
            <div class="dashboard-nav-item ${this.activeTab === 'loyalty' ? 'active' : ''}" data-tab="loyalty">
              <i data-lucide="gem"></i> Loyalty Points
            </div>
            <div class="dashboard-nav-item ${this.activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
              <i data-lucide="user"></i> Delivery Details
            </div>
          </aside>

          <!-- Main Content Pane -->
          <div class="dashboard-content">
            ${this.renderActiveTabHTML()}
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.attachDashboardEvents(container);
  },

  renderActiveTabHTML() {
    const user = State.user;

    // A. ORDERS HISTORY TAB
    if (this.activeTab === 'orders') {
      const orders = DB.getOrdersByUserId(user.id);
      if (orders.length === 0) {
        return `
          <div class="text-center" style="padding: 40px 0; color: var(--text-muted);">
            <i data-lucide="truck" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;"></i>
            <h3>No Orders Placed Yet</h3>
            <p style="margin-bottom: 20px;">You haven't bought any organic harvests yet.</p>
            <a href="/catalog" class="btn btn-primary btn-sm spa-route-btn">Browse Shop</a>
          </div>
        `;
      }

      const ordersHTML = orders.map(ord => {
        // Calculate status index for progress bar
        const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIdx = statusSteps.indexOf(ord.order_status);
        const progressWidth = currentIdx >= 0 ? (currentIdx / 3) * 100 : 0;

        return `
          <div class="order-dashboard-card" style="border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 24px; margin-bottom: 24px;">
            <div class="order-card-header" style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--bg-cream); padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <strong>Order Ref: ${ord.id}</strong><br>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Date: ${ord.date} | Mode: ${ord.payment_method}</span>
              </div>
              <div>
                <span class="status-badge status-${ord.order_status}">${ord.order_status.toUpperCase()}</span>
                <strong style="margin-left: 12px; color: var(--primary);">₹${ord.total_amount}</strong>
              </div>
            </div>

            <!-- Ordered Crops Grid -->
            <div class="order-items-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
              ${ord.items.map(item => `
                <div style="display: flex; gap: 10px; align-items: center;">
                  <img src="${item.images}" alt="${item.crop_name}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;">
                  <div>
                    <span style="font-size: 0.85rem; font-weight: 600; display: block;">${item.crop_name}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${item.quantity} units @ ₹${item.price}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Live Tracking Stepper -->
            ${ord.order_status !== 'cancelled' ? `
              <div class="order-tracking-card">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">📍 Live Delivery Tracking Timeline</div>
                
                <div class="tracking-stepper">
                  <div class="tracking-progress-bar" style="width: ${progressWidth}%;"></div>
                  
                  <div class="step-node ${currentIdx >= 0 ? 'completed' : ''} ${ord.order_status === 'pending' ? 'active' : ''}">
                    <div class="step-dot">1</div>
                    <div class="step-label">Ordered</div>
                  </div>
                  <div class="step-node ${currentIdx >= 1 ? 'completed' : ''} ${ord.order_status === 'processing' ? 'active' : ''}">
                    <div class="step-dot">2</div>
                    <div class="step-label">Harvested</div>
                  </div>
                  <div class="step-node ${currentIdx >= 2 ? 'completed' : ''} ${ord.order_status === 'shipped' ? 'active' : ''}">
                    <div class="step-dot">3</div>
                    <div class="step-label">In Transit</div>
                  </div>
                  <div class="step-node ${currentIdx >= 3 ? 'completed' : ''} ${ord.order_status === 'delivered' ? 'active' : ''}">
                    <div class="step-dot">4</div>
                    <div class="step-label">Delivered</div>
                  </div>
                </div>
              </div>
            ` : `<div style="color: var(--danger); font-weight: 600;">This order has been cancelled.</div>`}
          </div>
        `;
      }).join('');

      return `
        <div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 20px;">Your Orders</h3>
          ${ordersHTML}
        </div>
      `;
    }

    // B. WISHLIST TAB
    if (this.activeTab === 'wishlist') {
      const wishListIds = State.wishlist;
      if (wishListIds.length === 0) {
        return `
          <div class="text-center" style="padding: 40px 0; color: var(--text-muted);">
            <i data-lucide="heart" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;"></i>
            <h3>Wishlist is Empty</h3>
            <p style="margin-bottom: 20px;">Tap the heart icon on any crop product to add it here.</p>
            <a href="/catalog" class="btn btn-primary btn-sm spa-route-btn">Go to Shop</a>
          </div>
        `;
      }

      const productsHTML = wishListIds.map(id => {
        const p = DB.getProductById(id);
        if (!p) return '';
        return `
          <div class="wish-item" style="display: flex; gap: 16px; align-items: center; border: 1px solid var(--border-light); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 12px;">
            <img src="${p.images}" alt="${p.crop_name}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;">
            <div style="flex: 1;">
              <h4 style="font-family: var(--font-heading); font-weight: 700;">${p.crop_name}</h4>
              <span style="color: var(--primary); font-weight: 600;">₹${p.price}/${p.unit}</span>
            </div>
            <button class="btn btn-primary btn-sm add-wish-to-cart" data-id="${p.id}">Add to Cart</button>
            <button class="btn btn-secondary btn-sm remove-wish" data-id="${p.id}" style="color: var(--danger); border-color: rgba(220, 38, 38, 0.2);"><i data-lucide="trash-2"></i></button>
          </div>
        `;
      }).join('');

      return `
        <div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 20px;">My Starred Crops</h3>
          ${productsHTML}
        </div>
      `;
    }

    // C. LOYALTY POINTS TAB
    if (this.activeTab === 'loyalty') {
      const orders = DB.getOrdersByUserId(user.id);
      const totalSpend = orders.reduce((sum, o) => sum + o.total_amount, 0);
      const points = Math.floor(totalSpend / 10); // 10 points per ₹100 spent (i.e. spend / 10)

      return `
        <div style="text-align: center; padding: 20px 0;">
          <div class="points-circle" style="width: 140px; height: 140px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--accent), var(--accent-light)); color: var(--secondary); margin: 0 auto 20px auto; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: var(--shadow-md);">
            <span style="font-size: 2.2rem; font-weight: 800;">${points}</span>
            <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Points</span>
          </div>
          
          <h3 style="font-family: var(--font-heading); margin-bottom: 10px;">SG Farms Loyalty Club</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 24px auto;">You earn 10 points for every ₹100 spent. Redeem points for discount coupons or farm visit vouchers!</p>
          
          <div class="rewards-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 500px; margin: 0 auto; text-align: left;">
            <div style="border: 1px solid var(--border-light); padding: 16px; border-radius: var(--radius-sm); background-color: var(--bg-cream);">
              <strong>₹100 Off coupon</strong><br>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Cost: 200 Points</span>
              <button class="btn btn-secondary btn-sm btn-block" style="margin-top: 10px;" ${points < 200 ? 'disabled' : ''}>Redeem</button>
            </div>
            <div style="border: 1px solid var(--border-light); padding: 16px; border-radius: var(--radius-sm); background-color: var(--bg-cream);">
              <strong>Free Farm Tour</strong><br>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Cost: 500 Points</span>
              <button class="btn btn-secondary btn-sm btn-block" style="margin-top: 10px;" ${points < 500 ? 'disabled' : ''}>Redeem</button>
            </div>
          </div>
        </div>
      `;
    }

    // D. PROFILE EDIT TAB
    if (this.activeTab === 'profile') {
      return `
        <div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 20px;">Edit Delivery Profile</h3>
          
          <form id="edit-profile-form">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="prof-name" class="form-control" value="${user.name}" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Email Address (Cannot change)</label>
                <input type="email" class="form-control" value="${user.email}" disabled>
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="prof-phone" class="form-control" value="${user.phone || ''}" required pattern="[6789][0-9]{9}">
              </div>
            </div>

            <div class="form-group">
              <label>Default Shipping Address</label>
              <textarea id="prof-address" class="form-control" rows="3" required>${user.address || ''}</textarea>
            </div>

            <button type="submit" class="btn btn-primary">
              <i data-lucide="save"></i> Save Profile Details
            </button>
          </form>
        </div>
      `;
    }
  },

  attachDashboardEvents(container) {
    // Logout Handler
    const logoutBtn = container.querySelector('#dashboard-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        State.logout();
        this.render(container);
      });
    }

    // Tab toggling
    container.querySelectorAll('.dashboard-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        this.activeTab = item.getAttribute('data-tab');
        this.render(container);
      });
    });

    // Profile update submit
    const profForm = container.querySelector('#edit-profile-form');
    if (profForm) {
      profForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#prof-name').value;
        const phone = container.querySelector('#prof-phone').value;
        const address = container.querySelector('#prof-address').value;

        const updated = DB.updateUser({
          id: State.user.id,
          name,
          phone,
          address
        });

        if (updated) {
          State.login(updated, true); // update local state
          alert("Profile delivery details updated successfully!");
          this.render(container);
        }
      });
    }

    // Wishlist: Add to cart
    container.querySelectorAll('.add-wish-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const p = DB.getProductById(id);
        if (p) {
          State.addToCart(p, 1);
          alert(`${p.crop_name} added to cart!`);
        }
      });
    });

    // Wishlist: Remove from wishlist
    container.querySelectorAll('.remove-wish').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        State.toggleWishlist(id);
        this.render(container);
      });
    });
  }
};
