/* SG Farms Farmer/Admin Control Panel Component */
import { i18n } from '../translate.js';
import { DB } from '../db.js';
import { State } from '../state.js';

export const AdminComponent = {
  activeTab: 'inventory', // inventory, orders, bookings, logs, blog
  editingProduct: null,

  render(container) {
    // 1. Authorization guard
    if (!State.user || State.user.role !== 'admin') {
      container.innerHTML = `
        <div class="container section-padding text-center" style="min-height: 60vh; display: flex; align-items: center; justify-content: center;">
          <div style="background-color: var(--bg-white); max-width: 500px; padding: 48px; border-radius: var(--radius-md); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
            <div style="font-size: 3.5rem; color: var(--danger); margin-bottom: 20px;">⚠️</div>
            <h2>Access Denied</h2>
            <p style="color: var(--text-muted); margin-bottom: 30px;">This area is reserved for SG Farms farmers and administrators. Please log in with admin privileges.</p>
            <a href="/customer" class="btn btn-primary spa-route-btn">Go to Login</a>
          </div>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    const products = DB.getProducts();
    const orders = DB.getOrders();
    const bookings = DB.getBookings();
    
    // Calculate dashboard statistics
    const totalSales = orders.reduce((sum, o) => sum + (o.order_status !== 'cancelled' ? o.total_amount : 0), 0);
    const pendingOrders = orders.filter(o => o.order_status === 'pending' || o.order_status === 'processing').length;

    container.innerHTML = `
      <div class="container section-padding">
        <div class="dashboard-header-row">
          <div>
            <h2 style="font-family: var(--font-heading); color: var(--secondary);">Farmer Admin Hub</h2>
            <p>Control center for SG Farms | Welcome, <strong>Farmer Sures</strong></p>
          </div>
          <a href="/" class="btn btn-secondary btn-sm spa-route-btn">
            <i data-lucide="home"></i> View Site
          </a>
        </div>

        <!-- Admin Metrics Ribbon -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">₹</div>
            <div class="metric-details">
              <span>Total Revenue</span>
              <h3>₹${totalSales}</h3>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon"><i data-lucide="shopping-bag"></i></div>
            <div class="metric-details">
              <span>Active Orders</span>
              <h3>${pendingOrders}</h3>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon"><i data-lucide="users"></i></div>
            <div class="metric-details">
              <span>Farm Visitors</span>
              <h3>${bookings.length}</h3>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon"><i data-lucide="sprout"></i></div>
            <div class="metric-details">
              <span>Crops Listed</span>
              <h3>${products.length}</h3>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- Left Navigation Menu -->
          <aside class="dashboard-sidebar">
            <div class="dashboard-nav-item ${this.activeTab === 'inventory' ? 'active' : ''}" data-tab="inventory">
              <i data-lucide="clipboard-list"></i> Crop Inventory
            </div>
            <div class="dashboard-nav-item ${this.activeTab === 'orders' ? 'active' : ''}" data-tab="orders">
              <i data-lucide="truck"></i> Fulfillment
            </div>
            <div class="dashboard-nav-item ${this.activeTab === 'bookings' ? 'active' : ''}" data-tab="bookings">
              <i data-lucide="calendar"></i> Visit Bookings
            </div>
            <div class="dashboard-nav-item ${this.activeTab === 'logs' ? 'active' : ''}" data-tab="logs">
              <i data-lucide="rss"></i> Publish Field Logs
            </div>
            <div class="dashboard-nav-item ${this.activeTab === 'blog' ? 'active' : ''}" data-tab="blog">
              <i data-lucide="pen-tool"></i> Publish Blog
            </div>
          </aside>

          <!-- Main Workspace Pane -->
          <div class="dashboard-content">
            ${this.renderActiveTabWorkspace(products, orders, bookings)}
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.attachAdminEvents(container);
  },

  renderActiveTabWorkspace(products, orders, bookings) {
    // 1. INVENTORY CRUD WORKSPACE
    if (this.activeTab === 'inventory') {
      const rows = products.map(p => `
        <tr>
          <td><img src="${p.images}" alt="" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;"></td>
          <td><strong>${p.crop_name}</strong></td>
          <td>${p.category}</td>
          <td>₹${p.price}/${p.unit}</td>
          <td>${p.stock} ${p.unit}</td>
          <td><span class="status-badge ${p.organic ? 'status-delivered' : 'status-shipped'}">${p.organic ? 'Organic' : 'Regular'}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm edit-crop-btn" data-id="${p.id}" style="padding: 4px 8px;"><i data-lucide="edit-3"></i></button>
            <button class="btn btn-secondary btn-sm delete-crop-btn" data-id="${p.id}" style="padding: 4px 8px; color: var(--danger); border-color: rgba(220, 38, 38, 0.1);"><i data-lucide="trash-2"></i></button>
          </td>
        </tr>
      `).join('');

      return `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-family: var(--font-heading);">Crop Products List</h3>
            <button class="btn btn-primary btn-sm" id="admin-add-crop-btn">
              <i data-lucide="plus"></i> Add New Crop
            </div>
          </div>

          <!-- Add/Edit form overlay details inside work pane -->
          <div id="product-form-container" class="hidden" style="background-color: var(--bg-cream); border: 1px solid var(--border-green); border-radius: var(--radius-md); padding: 24px; margin-bottom: 24px;">
            <h4 id="prod-form-title" style="font-family: var(--font-heading); margin-bottom: 16px;">Add New Crop Produce</h4>
            <form id="admin-product-form">
              <input type="hidden" id="prod-id">
              
              <div class="form-row">
                <div class="form-group">
                  <label>Crop Name</label>
                  <input type="text" id="prod-name" class="form-control" required placeholder="e.g. Raw Ginger">
                </div>
                <div class="form-group">
                  <label>Crop Category</label>
                  <select id="prod-category" class="form-control" required>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                    <option value="Herbs">Herbs & Spices</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Price (₹)</label>
                  <input type="number" id="prod-price" class="form-control" required placeholder="120">
                </div>
                <div class="form-group">
                  <label>Unit</label>
                  <input type="text" id="prod-unit" class="form-control" required placeholder="kg / box / bunch" value="kg">
                </div>
                <div class="form-group">
                  <label>Available Stock</label>
                  <input type="number" id="prod-stock" class="form-control" required placeholder="500">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Estimated Harvest Date</label>
                  <input type="date" id="prod-harvest" class="form-control" required>
                </div>
                <div class="form-group">
                  <label>Image URL</label>
                  <input type="url" id="prod-image" class="form-control" required placeholder="https://images.unsplash.com/photo-...">
                </div>
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea id="prod-desc" class="form-control" rows="3" required placeholder="Crop characteristics, nutritional facts, packaging detail"></textarea>
              </div>

              <label class="toggle-checkbox-label" style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px; cursor: pointer;">
                <input type="checkbox" id="prod-organic" checked>
                <span class="custom-checkbox"></span>
                <span>Organic Farming Standard</span>
              </label>

              <div style="display: flex; gap: 12px;">
                <button type="submit" class="btn btn-primary btn-sm">Save Crop</button>
                <button type="button" class="btn btn-secondary btn-sm" id="cancel-prod-form-btn">Cancel</button>
              </div>
            </form>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Crop Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // 2. ORDER FULFILLMENT WORKSPACE
    if (this.activeTab === 'orders') {
      const rows = orders.map(ord => {
        const itemsSummary = ord.items.map(item => `${item.crop_name} (${item.quantity} ${item.price})`).join(', ');
        return `
          <tr>
            <td><strong>${ord.id}</strong></td>
            <td>${ord.delivery_address.split(',')[0]}</td>
            <td>${ord.date}</td>
            <td style="font-size: 0.8rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${itemsSummary}</td>
            <td><strong>₹${ord.total_amount}</strong></td>
            <td>
              <select class="order-status-selector form-control" data-id="${ord.id}" style="padding: 4px 8px; font-size: 0.8rem; min-width: 130px;">
                <option value="pending" ${ord.order_status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="processing" ${ord.order_status === 'processing' ? 'selected' : ''}>Processing</option>
                <option value="shipped" ${ord.order_status === 'shipped' ? 'selected' : ''}>Shipped</option>
                <option value="delivered" ${ord.order_status === 'delivered' ? 'selected' : ''}>Delivered</option>
                <option value="cancelled" ${ord.order_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
          </tr>
        `;
      }).join('');

      return `
        <div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 20px;">Order Delivery Management</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Items Purchased</th>
                  <th>Amount</th>
                  <th>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // 3. VISIT BOOKINGS WORKSPACE
    if (this.activeTab === 'bookings') {
      const rows = bookings.map(b => `
        <tr>
          <td><strong>${b.visitor_name}</strong></td>
          <td>${b.visit_date}</td>
          <td>${b.guests_count} Guests</td>
          <td><a href="tel:${b.phone}">${b.phone}</a></td>
          <td><span class="badge badge-organic" style="font-size: 0.75rem;">${b.workshop_interested}</span></td>
          <td><span class="status-badge status-delivered">${b.status.toUpperCase()}</span></td>
        </tr>
      `).join('');

      return `
        <div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 20px;">Farm Visits Schedule</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Visit Date</th>
                  <th>Guests</th>
                  <th>Contact Number</th>
                  <th>Workshop selection</th>
                  <th>Booking State</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // 4. PUBLISH FIELD LOG WORKSPACE
    if (this.activeTab === 'logs') {
      return `
        <div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 20px;">Publish Field Log Updates</h3>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Post live notes and photos of crop growth stages directly to the "Our Field Logs" page timeline.</p>
          
          <form id="admin-log-form" style="background-color: var(--bg-cream); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <div class="form-group">
              <label>Log Update Title</label>
              <input type="text" id="log-title" class="form-control" required placeholder="e.g. Sowing Guntur Chilli Seeds">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Photo URL (Optional)</label>
                <input type="url" id="log-image" class="form-control" placeholder="https://images.unsplash.com/photo-...">
              </div>
              <div class="form-group">
                <label>Comma separated tags</label>
                <input type="text" id="log-tags" class="form-control" placeholder="seeds, chilli, sowing, Guntur">
              </div>
            </div>

            <div class="form-group">
              <label>Log Description / Farmer update details</label>
              <textarea id="log-desc" class="form-control" rows="4" required placeholder="Describe crop status, fertilization, watering changes, or general weather..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary">
              <i data-lucide="send"></i> Post Log Update
            </button>
          </form>
        </div>
      `;
    }

    // 5. PUBLISH BLOG WORKSPACE
    if (this.activeTab === 'blog') {
      return `
        <div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 20px;">Publish Agricultural Blog Article</h3>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Publish guides and farming recipes to inform urban clients on health, organic standards, and seasonal eating.</p>
          
          <form id="admin-blog-form" style="background-color: var(--bg-cream); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <div class="form-group">
              <label>Blog Post Title</label>
              <input type="text" id="blog-title" class="form-control" required placeholder="e.g. Traditional Andhra Millet Porridge Recipe">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Blog Category</label>
                <select id="blog-category" class="form-control" required>
                  <option value="Healthy Living">Healthy Living</option>
                  <option value="Organic Farming">Organic Farming</option>
                  <option value="Recipes">Traditional Recipes</option>
                  <option value="Farming News">Field News</option>
                </select>
              </div>
              <div class="form-group">
                <label>Hero Image URL</label>
                <input type="url" id="blog-image" class="form-control" required placeholder="https://images.unsplash.com/photo-...">
              </div>
            </div>

            <div class="form-group">
              <label>Summary / Abstract (shown in card)</label>
              <input type="text" id="blog-summary" class="form-control" required placeholder="A short 1-sentence abstract of the article.">
            </div>

            <div class="form-group">
              <label>Article Content (Markdown or HTML supported)</label>
              <textarea id="blog-content" class="form-control" rows="6" required placeholder="Write the full details here..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary">
              <i data-lucide="book-open"></i> Publish Article
            </button>
          </form>
        </div>
      `;
    }
  },

  attachAdminEvents(container) {
    // Tab selectors
    container.querySelectorAll('.dashboard-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        this.activeTab = item.getAttribute('data-tab');
        this.render(container);
      });
    });

    // 1. INVENTORY HANDLERS
    if (this.activeTab === 'inventory') {
      const showFormBtn = container.querySelector('#admin-add-crop-btn');
      const cancelFormBtn = container.querySelector('#cancel-prod-form-btn');
      const formContainer = container.querySelector('#product-form-container');
      const form = container.querySelector('#admin-product-form');

      if (showFormBtn) {
        showFormBtn.addEventListener('click', () => {
          form.reset();
          container.querySelector('#prod-id').value = '';
          container.querySelector('#prod-form-title').textContent = "Add New Crop Produce";
          formContainer.classList.remove('hidden');
          showFormBtn.classList.add('hidden');
        });
      }

      if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => {
          formContainer.classList.add('hidden');
          showFormBtn.classList.remove('hidden');
        });
      }

      // CRUD edit crop
      container.querySelectorAll('.edit-crop-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const p = DB.getProductById(id);
          if (p) {
            container.querySelector('#prod-id').value = p.id;
            container.querySelector('#prod-name').value = p.crop_name;
            container.querySelector('#prod-category').value = p.category;
            container.querySelector('#prod-price').value = p.price;
            container.querySelector('#prod-unit').value = p.unit;
            container.querySelector('#prod-stock').value = p.stock;
            container.querySelector('#prod-harvest').value = p.harvest_date;
            container.querySelector('#prod-image').value = p.images;
            container.querySelector('#prod-desc').value = p.description;
            container.querySelector('#prod-organic').checked = p.organic;

            container.querySelector('#prod-form-title').textContent = `Edit Crop: ${p.crop_name}`;
            formContainer.classList.remove('hidden');
            if (showFormBtn) showFormBtn.classList.add('hidden');
          }
        });
      });

      // CRUD delete crop
      container.querySelectorAll('.delete-crop-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const p = DB.getProductById(id);
          if (p && confirm(`Are you sure you want to delete ${p.crop_name} from SG Farms catalog?`)) {
            DB.deleteProduct(id);
            this.render(container);
          }
        });
      });

      // Product Form Submit
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const id = container.querySelector('#prod-id').value;
          const crop_name = container.querySelector('#prod-name').value;
          const category = container.querySelector('#prod-category').value;
          const price = parseFloat(container.querySelector('#prod-price').value);
          const unit = container.querySelector('#prod-unit').value;
          const stock = parseInt(container.querySelector('#prod-stock').value);
          const harvest_date = container.querySelector('#prod-harvest').value;
          const images = container.querySelector('#prod-image').value;
          const description = container.querySelector('#prod-desc').value;
          const organic = container.querySelector('#prod-organic').checked;

          DB.saveProduct({
            id: id || undefined,
            crop_name,
            category,
            price,
            unit,
            stock,
            harvest_date,
            images,
            description,
            organic,
            delivery_time: "2 Days" // standard default
          });

          alert("Product saved successfully!");
          this.render(container);
        });
      }
    }

    // 2. ORDER FULFILLMENT HANDLERS
    if (this.activeTab === 'orders') {
      container.querySelectorAll('.order-status-selector').forEach(select => {
        select.addEventListener('change', (e) => {
          const id = select.getAttribute('data-id');
          const status = e.target.value;
          
          const updated = DB.updateOrderStatus(id, status);
          if (updated) {
            alert(`Order ${id} status updated to ${status}. Notification sync successful!`);
            this.render(container);
          }
        });
      });
    }

    // 4. PUBLISH FIELD LOG HANDLER
    if (this.activeTab === 'logs') {
      const logForm = container.querySelector('#admin-log-form');
      if (logForm) {
        logForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const title = container.querySelector('#log-title').value;
          const image = container.querySelector('#log-image').value || null;
          const tagsStr = container.querySelector('#log-tags').value;
          const description = container.querySelector('#log-desc').value;

          const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

          DB.saveFieldLog({
            title,
            image,
            tags,
            description
          });

          alert("Field log posted successfully! Check the Field Logs tab to view.");
          logForm.reset();
        });
      }
    }

    // 5. PUBLISH BLOG HANDLER
    if (this.activeTab === 'blog') {
      const blogForm = container.querySelector('#admin-blog-form');
      if (blogForm) {
        blogForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const title = container.querySelector('#blog-title').value;
          const category = container.querySelector('#blog-category').value;
          const image = container.querySelector('#blog-image').value;
          const summary = container.querySelector('#blog-summary').value;
          const content = container.querySelector('#blog-content').value;

          DB.saveBlog({
            title,
            category,
            image,
            summary,
            content,
            author: "Farmer Sures"
          });

          alert("Agricultural blog article published successfully!");
          blogForm.reset();
        });
      }
    }
  }
};
