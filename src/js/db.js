/* SG Farms Database Engine & LocalStorage Seed Logic */

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    crop_name: "Banganapalli Mango",
    category: "Fruits",
    price: 120,
    unit: "kg",
    stock: 500,
    description: "Plucked directly from our mature orchards in Mukkollu. Known for its distinct sweet aroma, fiber-less flesh, and organic farming standard. Perfect for seasonal summer desserts.",
    images: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    harvest_date: "2026-06-15",
    organic: true,
    delivery_time: "2 Days"
  },
  {
    id: "p2",
    crop_name: "Premium HMT Rice",
    category: "Grains",
    price: 65,
    unit: "kg",
    stock: 1200,
    description: "Fine grain paddy harvested from Krishna river basin fields. Aged naturally for 12 months to ensure non-sticky texture and maximum expanding ratio after cooking.",
    images: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    harvest_date: "2025-11-20",
    organic: false,
    delivery_time: "3 Days"
  },
  {
    id: "p3",
    crop_name: "Organic Country Tomatoes",
    category: "Vegetables",
    price: 40,
    unit: "kg",
    stock: 250,
    description: "Naturally ripened vine tomatoes grown using Panchagavya organic fertilizer. Rich in tanginess and vitamin C, ideal for Andhra traditional chutneys.",
    images: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80",
    harvest_date: "2026-05-10",
    organic: true,
    delivery_time: "1 Day"
  },
  {
    id: "p4",
    crop_name: "Raw Turmeric Rhizomes",
    category: "Herbs",
    price: 180,
    unit: "kg",
    stock: 150,
    description: "Highly potent turmeric roots grown in sandy loam soils of Mukkollu. Contains superior curcumin content, prized for traditional health remedies and spices.",
    images: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    harvest_date: "2026-04-05",
    organic: true,
    delivery_time: "2 Days"
  },
  {
    id: "p5",
    crop_name: "Sweet Baby Corn",
    category: "Vegetables",
    price: 80,
    unit: "kg",
    stock: 300,
    description: "Tender, crunchy, and naturally sweet mini corn cobs. Hand-picked at sunrise to lock in freshness, processed hygienically. Ready for stir-fries and salads.",
    images: "https://images.unsplash.com/photo-1529313732991-13f674f9d854?auto=format&fit=crop&w=600&q=80",
    harvest_date: "2026-05-22",
    organic: true,
    delivery_time: "1 Day"
  },
  {
    id: "p6",
    crop_name: "Organic Country Papaya",
    category: "Fruits",
    price: 70,
    unit: "kg",
    stock: 180,
    description: "Sweet Red Lady Papaya variety grown under strictly organic mulch farming. Sweet, pulpy, and completely free of chemical sprays.",
    images: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80",
    harvest_date: "2026-05-18",
    organic: true,
    delivery_time: "2 Days"
  }
];

const DEFAULT_USERS = [
  {
    id: "u_admin",
    name: "Farmer Sures",
    email: "admin@farm.com",
    password: "Suresh@63030", // simplified for demo
    role: "admin",
    phone: "+91 99999 99999",
    address: "SG Farms HQ, Mukkollu Village, Krishna District, AP"
  },
  {
    id: "u_customer",
    name: "Urban Buyer",
    email: "customer@farm.com",
    password: "user123",
    role: "customer",
    phone: "+91 88888 88888",
    address: "Flat 402, Green Meadows, Benz Circle, Vijayawada, AP - 520010"
  }
];

const DEFAULT_REVIEWS = [
  { id: "r1", product_id: "p1", user_name: "Kalyan Ram", rating: 5, comment: "Hands down the best Banganapalli mangoes I have had in years. Fully organic flavor, sweet and juicy!", date: "2026-05-20" },
  { id: "r2", product_id: "p1", user_name: "Sneha Reddy", rating: 4, comment: "Really sweet. Delivery took 3 days instead of 2 but the quality was exceptional. Will buy again.", date: "2026-05-15" },
  { id: "r3", product_id: "p3", user_name: "Madhava Rao", rating: 5, comment: "Fresh tomatoes with high tanginess. Ideal for making Avakaya tomato pickles.", date: "2026-05-22" },
  { id: "r4", product_id: "p2", user_name: "Venkata Lakshmi", rating: 4, comment: "Clean rice grains, smells pleasant after boiling. Ideal daily rice.", date: "2026-05-12" }
];

const DEFAULT_BLOGS = [
  {
    id: "b1",
    title: "Why Direct-From-Farm Produce Beats Cold Storages",
    category: "Healthy Living",
    author: "Farmer Sures",
    date: "2026-05-24",
    summary: "Understand how vitamins deteriorate in commercial cold warehouses, and why direct harvesting preserves taste and maximum nutrients.",
    content: "When you buy vegetables from a supermarket, they have typically traveled for 3 to 7 days, spending prolonged hours in carbon-dioxide rich cold containers. This halts natural ripening and strips essential water-soluble vitamins like Vitamin C and B-complex. By ordering from SG Farms, crops are harvested at dawn and delivered to your doorstep within 24 to 48 hours, locking in active enzymes, natural moisture, and pure organic flavors. Choose fresh, live foods for your family's daily meals.",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "b2",
    title: "Transitioning to 100% Panchagavya Organic Cultivation",
    category: "Organic Farming",
    author: "Farmer Sures",
    date: "2026-05-18",
    summary: "Discover how we prepare Panchagavya, a traditional biodynamic elixir, to nourish soils without chemical pesticides.",
    content: "Panchagavya is a traditional Vedic formulation made from five primary cow products: dung, urine, milk, curd, and ghee, combined with jaggery, banana, and tender coconut water. It acts as both a rich nutrient source and a powerful pest repellent. At SG Farms in Mukkollu, we have completely phased out chemical urea. The resulting yield is not only safer to consume, but the soil microbiome has become fully revitalized with earthworms and beneficial bacteria, leading to natural pest resistance.",
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80"
  }
];

const DEFAULT_FIELD_LOGS = [
  {
    id: "l1",
    title: "Summer Mango Harvesting Begins",
    date: "2026-05-25",
    description: "The Banganapalli orchards are ready! Our farm hands are harvesting fruits carefully using traditional baskets to avoid impact bruises.",
    image: "https://images.unsplash.com/photo-1488459718432-0125aa88a66e?auto=format&fit=crop&w=800&q=80",
    tags: ["Harvesting", "Mangoes", "Mukkollu"]
  },
  {
    id: "l2",
    title: "Turmeric Sprouting Stage Completed",
    date: "2026-05-10",
    description: "Our newly sown turmeric rhizomes have developed healthy green shoots. We have applied a second coat of organic vermicompost.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    tags: ["Turmeric", "Soil Care", "Sprouts"]
  },
  {
    id: "l3",
    title: "Tomato Vines Flowering Abundantly",
    date: "2026-04-28",
    description: "Yellow flower buds have covered the tomato patch. Honeybee activity is peak today, ensuring excellent natural pollination.",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80",
    tags: ["Tomatoes", "Flowering", "Pollination"]
  }
];

const DEFAULT_ORDERS = [
  {
    id: "ord_1001",
    user_id: "u_customer",
    items: [
      { product_id: "p1", crop_name: "Banganapalli Mango", price: 120, quantity: 5, images: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80" },
      { product_id: "p3", crop_name: "Organic Country Tomatoes", price: 40, quantity: 2, images: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80" }
    ],
    total_amount: 680,
    order_status: "shipped", // pending, processing, shipped, delivered, cancelled
    payment_status: "paid",
    payment_method: "UPI Scan",
    delivery_address: "Flat 402, Green Meadows, Benz Circle, Vijayawada, AP - 520010",
    date: "2026-05-24",
    delivery_timeline: {
      pending: "2026-05-24T10:00:00Z",
      processing: "2026-05-24T14:30:00Z",
      shipped: "2026-05-25T08:00:00Z",
      delivered: null
    }
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: "bk_9001",
    user_id: "u_customer",
    visitor_name: "Urban Buyer",
    visit_date: "2026-06-07",
    guests_count: 3,
    phone: "+91 88888 88888",
    status: "confirmed",
    workshop_interested: "Organic Compost Prep Workshop"
  }
];

// Database Engine Object
export const DB = {
  init() {
    if (!localStorage.getItem("sg_initialized")) {
      localStorage.setItem("sg_products", JSON.stringify(DEFAULT_PRODUCTS));
      localStorage.setItem("sg_users", JSON.stringify(DEFAULT_USERS));
      localStorage.setItem("sg_reviews", JSON.stringify(DEFAULT_REVIEWS));
      localStorage.setItem("sg_blogs", JSON.stringify(DEFAULT_BLOGS));
      localStorage.setItem("sg_field_logs", JSON.stringify(DEFAULT_FIELD_LOGS));
      localStorage.setItem("sg_orders", JSON.stringify(DEFAULT_ORDERS));
      localStorage.setItem("sg_bookings", JSON.stringify(DEFAULT_BOOKINGS));
      localStorage.setItem("sg_initialized", "true");
      console.log("LocalStorage Seeded successfully!");
    } else {
      // Ensure admin password updates to Suresh@63030 on reload
      try {
        const users = JSON.parse(localStorage.getItem("sg_users") || "[]");
        const admin = users.find(u => u.id === 'u_admin');
        if (admin && admin.password !== 'Suresh@63030') {
          admin.password = 'Suresh@63030';
          localStorage.setItem("sg_users", JSON.stringify(users));
          console.log("Admin password updated to Suresh@63030");
        }
      } catch (e) {
        console.error("Error updating admin password in local storage", e);
      }
    }
  },

  // Products CRUD
  getProducts() {
    return JSON.parse(localStorage.getItem("sg_products") || "[]");
  },
  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  },
  saveProduct(product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      product.id = "p_" + Date.now();
      products.push(product);
    }
    localStorage.setItem("sg_products", JSON.stringify(products));
    return product;
  },
  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem("sg_products", JSON.stringify(products));
  },

  // Users Auth & Management
  getUsers() {
    return JSON.parse(localStorage.getItem("sg_users") || "[]");
  },
  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  registerUser(user) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      throw new Error("Email already registered!");
    }
    user.id = "u_" + Date.now();
    user.role = "customer"; // defaults to customer
    users.push(user);
    localStorage.setItem("sg_users", JSON.stringify(users));
    return user;
  },
  updateUser(user) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
      localStorage.setItem("sg_users", JSON.stringify(users));
      return users[index];
    }
    return null;
  },

  // Orders CRUD
  getOrders() {
    return JSON.parse(localStorage.getItem("sg_orders") || "[]");
  },
  getOrdersByUserId(userId) {
    return this.getOrders().filter(o => o.user_id === userId);
  },
  getOrderById(id) {
    return this.getOrders().find(o => o.id === id);
  },
  createOrder(order) {
    const orders = this.getOrders();
    order.id = "ord_" + (1000 + orders.length + 1);
    order.date = new Date().toISOString().split('T')[0];
    order.order_status = "pending";
    order.delivery_timeline = {
      pending: new Date().toISOString(),
      processing: null,
      shipped: null,
      delivered: null
    };
    orders.push(order);
    localStorage.setItem("sg_orders", JSON.stringify(orders));
    return order;
  },
  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index].order_status = status;
      if (!orders[index].delivery_timeline) {
        orders[index].delivery_timeline = { pending: orders[index].date, processing: null, shipped: null, delivered: null };
      }
      orders[index].delivery_timeline[status] = new Date().toISOString();
      localStorage.setItem("sg_orders", JSON.stringify(orders));
      return orders[index];
    }
    return null;
  },

  // Reviews CRUD
  getReviews() {
    return JSON.parse(localStorage.getItem("sg_reviews") || "[]");
  },
  getReviewsByProductId(productId) {
    return this.getReviews().filter(r => r.product_id === productId);
  },
  addReview(review) {
    const reviews = this.getReviews();
    review.id = "r_" + Date.now();
    review.date = new Date().toISOString().split('T')[0];
    reviews.push(review);
    localStorage.setItem("sg_reviews", JSON.stringify(reviews));
    return review;
  },

  // Blogs CRUD
  getBlogs() {
    return JSON.parse(localStorage.getItem("sg_blogs") || "[]");
  },
  saveBlog(blog) {
    const blogs = this.getBlogs();
    const index = blogs.findIndex(b => b.id === blog.id);
    if (index >= 0) {
      blogs[index] = blog;
    } else {
      blog.id = "b_" + Date.now();
      blog.date = new Date().toISOString().split('T')[0];
      blogs.push(blog);
    }
    localStorage.setItem("sg_blogs", JSON.stringify(blogs));
    return blog;
  },

  // Field Logs CRUD
  getFieldLogs() {
    return JSON.parse(localStorage.getItem("sg_field_logs") || "[]");
  },
  saveFieldLog(log) {
    const logs = this.getFieldLogs();
    log.id = "l_" + Date.now();
    log.date = new Date().toISOString().split('T')[0];
    logs.unshift(log); // newest first
    localStorage.setItem("sg_field_logs", JSON.stringify(logs));
    return log;
  },

  // Visit Bookings
  getBookings() {
    return JSON.parse(localStorage.getItem("sg_bookings") || "[]");
  },
  getBookingsByUserId(userId) {
    return this.getBookings().filter(b => b.user_id === userId);
  },
  createBooking(booking) {
    const bookings = this.getBookings();
    booking.id = "bk_" + (9000 + bookings.length + 1);
    booking.status = "confirmed"; // auto confirm for demo
    bookings.push(booking);
    localStorage.setItem("sg_bookings", JSON.stringify(bookings));
    return booking;
  }
};
