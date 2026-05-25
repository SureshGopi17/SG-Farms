/* SG Farms Shopping Cart Drawer & Checkout Component */
import { i18n } from '../translate.js';
import { DB } from '../db.js';
import { State } from '../state.js';

export const CartComponent = {
  // 1. Refresh/Draw the shopping cart sliding drawer
  updateCartDrawer() {
    const lang = State.language;
    const items = State.cart;
    
    // Update navbar indicators
    const countBadge = document.getElementById('cart-count');
    const drawerBadge = document.getElementById('cart-drawer-count');
    
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    if (countBadge) countBadge.textContent = totalCount;
    if (drawerBadge) drawerBadge.textContent = totalCount;

    const itemsContainer = document.getElementById('cart-drawer-items');
    const footer = document.getElementById('cart-drawer-footer');
    
    if (!itemsContainer) return;

    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <i data-lucide="shopping-cart"></i>
          <p>${i18n.t('cart_empty', lang)}</p>
          <a href="/catalog" class="btn btn-primary btn-sm spa-route-btn" id="close-drawer-shop-btn">Shop Fresh Crops</a>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      lucide.createIcons();
      
      // Hook close button on the empty-state button
      const shopBtn = document.getElementById('close-drawer-shop-btn');
      if (shopBtn) {
        shopBtn.addEventListener('click', () => {
          this.closeDrawer();
        });
      }
      return;
    }

    if (footer) footer.style.display = 'block';

    // Build items HTML
    itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.images}" alt="${item.crop_name}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.crop_name}</h4>
            <span class="cart-item-meta">Price: ₹${item.price}/${item.unit}</span>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-controls">
              <button class="qty-btn dec-qty" data-id="${item.product_id}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn inc-qty" data-id="${item.product_id}">+</button>
            </div>
            <button class="remove-item-btn" data-id="${item.product_id}">
              <i data-lucide="trash-2"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Update prices
    const subtotal = State.getCartSubtotal();
    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;

    lucide.createIcons();
    this.attachDrawerEvents(itemsContainer);
  },

  attachDrawerEvents(container) {
    // Quantity adjustments
    container.querySelectorAll('.dec-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = State.cart.find(i => i.product_id === id);
        if (item && item.quantity > 1) {
          State.updateCartQuantity(id, item.quantity - 1);
        }
      });
    });

    container.querySelectorAll('.inc-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = State.cart.find(i => i.product_id === id);
        if (item) {
          // Check stock
          const p = DB.getProductById(id);
          if (p && item.quantity < p.stock) {
            State.updateCartQuantity(id, item.quantity + 1);
          } else {
            alert(`Sorry, maximum available stock is ${p ? p.stock : 100} ${p ? p.unit : 'kg'}.`);
          }
        }
      });
    });

    // Remove item
    container.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        State.removeFromCart(id);
      });
    });
  },

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      this.updateCartDrawer();
      drawer.classList.add('show');
      overlay.classList.add('show');
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('show');
      overlay.classList.remove('show');
    }
  },

  // 2. Render Checkout Page
  render(container) {
    const lang = State.language;
    const cartItems = State.cart;
    const subtotal = State.getCartSubtotal();

    if (cartItems.length === 0) {
      container.innerHTML = `
        <div class="container section-padding text-center">
          <div class="empty-checkout" style="padding: 60px; background-color: var(--bg-white); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <i data-lucide="shopping-bag" style="width: 60px; height: 60px; color: var(--border-light); margin-bottom: 20px;"></i>
            <h2>Your Cart is Empty</h2>
            <p style="margin-bottom: 30px;">Add crops from our catalog before checking out.</p>
            <a href="/catalog" class="btn btn-primary spa-route-btn">Go to Shop</a>
          </div>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Build Order Summary HTML
    const summaryHTML = cartItems.map(item => `
      <div class="summary-item-row" style="display: flex; gap: 12px; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--border-light); margin-bottom: 12px;">
        <img src="${item.images}" alt="${item.crop_name}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;">
        <div style="flex: 1;">
          <h5 style="font-family: var(--font-heading); font-weight: 600;">${item.crop_name}</h5>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Qty: ${item.quantity} ${item.unit}</span>
        </div>
        <strong>₹${item.price * item.quantity}</strong>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="container section-padding">
        <h2 style="margin-bottom: 24px; font-family: var(--font-heading);">Checkout Securely</h2>
        
        <div class="checkout-layout grid grid-2" style="grid-template-columns: 1.2fr 0.8fr; align-items: start;">
          <!-- Left: Address & Payment Forms -->
          <div class="checkout-forms" style="background-color: var(--bg-white); padding: 32px; border-radius: var(--radius-md); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
            
            <form id="checkout-payment-form">
              <h3 style="margin-bottom: 20px; font-family: var(--font-heading); font-size: 1.3rem; color: var(--primary-light);">1. Delivery Details</h3>
              
              <div class="form-group">
                <label for="shipping-name">Receiver Name</label>
                <input type="text" id="shipping-name" class="form-control" placeholder="Enter recipient full name" required value="${State.user ? State.user.name : ''}">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="shipping-phone">Phone Number (+91)</label>
                  <input type="tel" id="shipping-phone" class="form-control" placeholder="10-digit mobile" pattern="[6789][0-9]{9}" required value="${State.user ? State.user.phone || '' : ''}">
                </div>
                <div class="form-group">
                  <label for="shipping-email">Email Address</label>
                  <input type="email" id="shipping-email" class="form-control" placeholder="name@email.com" required value="${State.user ? State.user.email || '' : ''}">
                </div>
              </div>

              <div class="form-group">
                <label for="shipping-address">Delivery Address (AP Areas only)</label>
                <textarea id="shipping-address" class="form-control" rows="3" placeholder="Full home/apartment address, landmark, city" required>${State.user ? State.user.address || '' : ''}</textarea>
              </div>

              <h3 style="margin-top: 30px; margin-bottom: 20px; font-family: var(--font-heading); font-size: 1.3rem; color: var(--primary-light);">2. Select Payment Method</h3>
              
              <div class="payment-methods-selector" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                <label class="payment-radio-label" style="display: flex; gap: 12px; align-items: center; padding: 16px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer; transition: all var(--transition-fast);">
                  <input type="radio" name="payment-option" value="upi" checked>
                  <div style="font-size: 1.5rem;">📱</div>
                  <div>
                    <strong>UPI QR Scanner</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Scan and pay instantly from GPay, PhonePe, Paytm</div>
                  </div>
                </label>

                <label class="payment-radio-label" style="display: flex; gap: 12px; align-items: center; padding: 16px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer; transition: all var(--transition-fast);">
                  <input type="radio" name="payment-option" value="razorpay">
                  <div style="font-size: 1.5rem;">💳</div>
                  <div>
                    <strong>Razorpay Credit / Debit Card</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Visa, Mastercard, RuPay, Maestro accepted</div>
                  </div>
                </label>
              </div>

              <!-- UPI QR Code Simulation Block -->
              <div id="upi-qr-block" class="payment-sim-block" style="background-color: var(--bg-cream); border: 1px solid var(--border-green); padding: 24px; border-radius: var(--radius-md); text-align: center; margin-bottom: 24px;">
                <h4 style="margin-bottom: 12px; font-family: var(--font-heading);">Scan QR to Pay SG Farms</h4>
                <div class="qr-placeholder" style="width: 160px; height: 160px; background-color: var(--bg-white); border: 1px solid var(--border-light); margin: 0 auto 12px auto; display: flex; align-items: center; justify-content: center; font-size: 5rem; border-radius: var(--radius-sm);">
                  📱🔗
                </div>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Please scan the generated demo QR to complete ₹${subtotal} payment. Click "Confirm Payment" after scanning.</p>
              </div>

              <!-- Card form Simulation Block -->
              <div id="card-details-block" class="payment-sim-block hidden" style="background-color: var(--bg-cream); border: 1px solid var(--border-light); padding: 24px; border-radius: var(--radius-md); margin-bottom: 24px;">
                <h4 style="margin-bottom: 12px; font-family: var(--font-heading);">Card Details</h4>
                <div class="form-group">
                  <label>Card Number</label>
                  <input type="text" class="form-control" placeholder="4111 2222 3333 4444" pattern="[0-9]{16}">
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" class="form-control" placeholder="MM/YY">
                  </div>
                  <div class="form-group">
                    <label>CVV</label>
                    <input type="password" class="form-control" placeholder="***">
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" id="confirm-payment-btn">
                <i data-lucide="shield-check"></i> Confirm Payment & Place Order (₹${subtotal})
              </button>
            </form>

          </div>

          <!-- Right: Summary Panel -->
          <div class="checkout-summary" style="background-color: var(--bg-white); padding: 32px; border-radius: var(--radius-md); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); position: sticky; top: 100px;">
            <h3 style="margin-bottom: 20px; font-family: var(--font-heading); font-size: 1.3rem;">Order Summary</h3>
            
            <div class="checkout-summary-items">
              ${summaryHTML}
            </div>

            <div class="checkout-calc-block" style="margin-top: 20px; border-top: 2px solid var(--bg-cream); padding-top: 20px; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Cart Subtotal</span>
                <strong>₹${subtotal}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Delivery (Andhra Pradesh)</span>
                <span style="color: var(--success); font-weight: 700;">FREE</span>
              </div>
              <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 6px 0;">
              <div style="display: flex; justify-content: space-between; font-size: 1.2rem; color: var(--primary);">
                <strong>Total Amount</strong>
                <strong>₹${subtotal}</strong>
              </div>
            </div>

            <div style="margin-top: 24px; font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 10px; align-items: center; background-color: var(--primary-xlight); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-green);">
              <i data-lucide="shield-alert" style="color: var(--primary); flex-shrink: 0;"></i>
              <span>All payment channels are mock simulations for demonstration. No real money will be charged.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.attachCheckoutEvents(container, cartItems, subtotal);
  },

  attachCheckoutEvents(container, cartItems, subtotal) {
    const form = container.querySelector('#checkout-payment-form');
    const paymentRadios = container.querySelectorAll('input[name="payment-option"]');
    const upiBlock = container.querySelector('#upi-qr-block');
    const cardBlock = container.querySelector('#card-details-block');

    // Toggle simulated payment blocks
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'upi') {
          upiBlock.classList.remove('hidden');
          cardBlock.classList.add('hidden');
        } else {
          upiBlock.classList.add('hidden');
          cardBlock.classList.remove('hidden');
        }
      });
    });

    // Form submit / payment confirm
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const shippingName = container.querySelector('#shipping-name').value;
        const shippingPhone = container.querySelector('#shipping-phone').value;
        const shippingAddress = container.querySelector('#shipping-address').value;
        const paymentOption = container.querySelector('input[name="payment-option"]:checked').value;

        // Button state transition
        const confirmBtn = container.querySelector('#confirm-payment-btn');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `<span class="spinner" style="width: 18px; height: 18px; border-width: 2px; margin-right: 8px;"></span> Processing payment...`;

        setTimeout(() => {
          // Determine User ID (guest vs logged in)
          const userId = State.user ? State.user.id : "guest";

          // Create order in DB
          const placedOrder = DB.createOrder({
            user_id: userId,
            items: cartItems.map(c => ({
              product_id: c.product_id,
              crop_name: c.crop_name,
              price: c.price,
              quantity: c.quantity,
              images: c.images
            })),
            total_amount: subtotal,
            payment_status: "paid",
            payment_method: paymentOption === 'upi' ? 'UPI Scan' : 'Credit/Debit Card',
            delivery_address: `${shippingName}, Phone: ${shippingPhone}, Addr: ${shippingAddress}`
          });

          // Deduct stocks in DB
          cartItems.forEach(c => {
            const prod = DB.getProductById(c.product_id);
            if (prod) {
              prod.stock = Math.max(0, prod.stock - c.quantity);
              DB.saveProduct(prod);
            }
          });

          // Reset cart state
          State.clearCart();

          // Render gorgeous Order Confirmation screen
          this.renderConfirmation(container, placedOrder);
        }, 1500);
      });
    }
  },

  renderConfirmation(container, order) {
    container.innerHTML = `
      <div class="container section-padding text-center">
        <div class="order-success-panel" style="max-width: 600px; margin: 0 auto; background-color: var(--bg-white); padding: 48px; border-radius: var(--radius-lg); border: 2px solid var(--border-green); box-shadow: var(--shadow-lg);">
          <div class="success-icon" style="font-size: 4rem; color: var(--success); margin-bottom: 24px;">🎉</div>
          <h2 style="font-family: var(--font-heading); margin-bottom: 12px;">Order Placed Successfully!</h2>
          <p style="color: var(--text-muted); margin-bottom: 30px;">Thank you for supporting SG Farms! Your order details have been saved, and our farmers are preparing the harvest.</p>
          
          <div class="order-details-summary-box" style="background-color: var(--bg-cream); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 24px; text-align: left; margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Order Reference ID:</span>
              <strong style="color: var(--primary);">${order.id}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Payment Mode:</span>
              <strong>${order.payment_method}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Total Price Paid:</span>
              <strong>₹${order.total_amount}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Estimated Delivery:</span>
              <strong style="color: var(--success);">2 Days (Andhra Pradesh Area)</strong>
            </div>
          </div>

          <div style="display: flex; gap: 16px; justify-content: center;">
            <a href="/catalog" class="btn btn-secondary spa-route-btn">Continue Shopping</a>
            <button class="btn btn-primary" id="track-placed-order-btn" data-id="${order.id}">
              <i data-lucide="truck"></i> Track Order
            </button>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    
    // Wire track order button
    const trackBtn = container.querySelector('#track-placed-order-btn');
    if (trackBtn) {
      trackBtn.addEventListener('click', () => {
        // Redirect to customer dashboard orders tab
        if (State.user) {
          // Navigate to customer portal
          window.history.pushState({}, "", "/customer");
          window.dispatchEvent(new CustomEvent('popstate'));
        } else {
          // If guest, alert or login redirect
          alert(`Order tracking is best viewed under Customer Dashboard. Login with customer@farm.com (Password: user123) to view history!`);
          window.history.pushState({}, "", "/customer");
          window.dispatchEvent(new CustomEvent('popstate'));
        }
      });
    }
  }
};
