/* SG Farms Application State Manager */

export const State = {
  user: null,
  cart: [],
  wishlist: [],
  language: 'en', // 'en', 'te', 'hi'

  init() {
    // Load active session
    const savedUser = sessionStorage.getItem("sg_current_user") || localStorage.getItem("sg_current_user");
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }

    // Load Cart
    const savedCart = localStorage.getItem(`sg_cart_${this.user ? this.user.id : 'guest'}`);
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    } else {
      this.cart = [];
    }

    // Load Wishlist
    const savedWish = localStorage.getItem(`sg_wishlist_${this.user ? this.user.id : 'guest'}`);
    if (savedWish) {
      this.wishlist = JSON.parse(savedWish);
    } else {
      this.wishlist = [];
    }

    // Load Language
    const savedLang = localStorage.getItem("sg_language");
    if (savedLang) {
      this.language = savedLang;
    }
  },

  // Auth Operations
  login(user, remember = false) {
    this.user = user;
    const sessionStr = JSON.stringify(user);
    if (remember) {
      localStorage.setItem("sg_current_user", sessionStr);
    } else {
      sessionStorage.setItem("sg_current_user", sessionStr);
    }
    
    // Merge guest cart/wishlist into user cart/wishlist
    this.syncUserData();
    this.notify('authChanged');
  },

  logout() {
    this.user = null;
    sessionStorage.removeItem("sg_current_user");
    localStorage.removeItem("sg_current_user");
    this.cart = [];
    this.wishlist = [];
    this.notify('authChanged');
    this.notify('cartUpdated');
    this.notify('wishlistUpdated');
  },

  syncUserData() {
    // Cart sync
    const userCartKey = `sg_cart_${this.user.id}`;
    const guestCartKey = 'sg_cart_guest';
    const guestCart = JSON.parse(localStorage.getItem(guestCartKey) || "[]");
    const userCart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
    
    // Merge logic: combine quantities
    const mergedCart = [...userCart];
    guestCart.forEach(gItem => {
      const existing = mergedCart.find(uItem => uItem.product_id === gItem.product_id);
      if (existing) {
        existing.quantity += gItem.quantity;
      } else {
        mergedCart.push(gItem);
      }
    });

    this.cart = mergedCart;
    localStorage.setItem(userCartKey, JSON.stringify(this.cart));
    localStorage.removeItem(guestCartKey);

    // Wishlist sync
    const userWishKey = `sg_wishlist_${this.user.id}`;
    const guestWishKey = 'sg_wishlist_guest';
    const guestWish = JSON.parse(localStorage.getItem(guestWishKey) || "[]");
    const userWish = JSON.parse(localStorage.getItem(userWishKey) || "[]");
    
    const mergedWish = Array.from(new Set([...userWish, ...guestWish]));
    this.wishlist = mergedWish;
    localStorage.setItem(userWishKey, JSON.stringify(this.wishlist));
    localStorage.removeItem(guestWishKey);
  },

  // Cart Operations
  addToCart(product, quantity = 1) {
    const existing = this.cart.find(item => item.product_id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({
        product_id: product.id,
        crop_name: product.crop_name,
        price: product.price,
        unit: product.unit,
        quantity: quantity,
        images: product.images
      });
    }
    this.saveCart();
    this.notify('cartUpdated');
  },

  updateCartQuantity(productId, quantity) {
    const item = this.cart.find(item => item.product_id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
      this.notify('cartUpdated');
    }
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.product_id !== productId);
    this.saveCart();
    this.notify('cartUpdated');
  },

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.notify('cartUpdated');
  },

  saveCart() {
    const key = `sg_cart_${this.user ? this.user.id : 'guest'}`;
    localStorage.setItem(key, JSON.stringify(this.cart));
  },

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Wishlist Operations
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    if (index >= 0) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(productId);
    }
    this.saveWishlist();
    this.notify('wishlistUpdated');
  },

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  },

  saveWishlist() {
    const key = `sg_wishlist_${this.user ? this.user.id : 'guest'}`;
    localStorage.setItem(key, JSON.stringify(this.wishlist));
  },

  // Language Operations
  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem("sg_language", lang);
    this.notify('languageChanged');
  },

  // Helper Event Dispatcher
  notify(eventName) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: this }));
  }
};
