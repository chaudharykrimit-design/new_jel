const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const crypto = require("crypto");

// Load env
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "aurum_jewels_secret_key_2025";

// ─── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increased for potential base64 images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const multer = require("multer");
const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ─── Auth Helpers ──────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const r = Math.floor(1000 + Math.random() * 9000);
  return `AU${y}${m}${d}${r}`;
}

// ═══════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const id = crypto.randomUUID();
    const passwordHash = bcrypt.hashSync(password, 10);
    db.prepare(
      "INSERT INTO users (id, name, email, phone, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, name, email, phone || "", passwordHash, "customer");

    const user = { id, name, email, phone: phone || "", role: "customer" };
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const user = db.prepare("SELECT id, name, email, phone, role, addresses, created_at FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.addresses = JSON.parse(user.addresses || "[]");
  res.json({ user });
});

app.put("/api/auth/profile", authMiddleware, (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const updates = [];
    const params = [];
    if (name) { updates.push("name = ?"); params.push(name); }
    if (phone !== undefined) { updates.push("phone = ?"); params.push(phone); }
    if (addresses) { updates.push("addresses = ?"); params.push(JSON.stringify(addresses)); }
    if (updates.length === 0) return res.status(400).json({ error: "Nothing to update" });
    params.push(req.user.id);
    db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...params);
    const user = db.prepare("SELECT id, name, email, phone, role, addresses FROM users WHERE id = ?").get(req.user.id);
    user.addresses = JSON.parse(user.addresses || "[]");
    res.json({ user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});

// ═══════════════════════════════════════════════════════════
// CATEGORIES ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/api/categories", (req, res) => {
  const cats = db.prepare("SELECT * FROM categories ORDER BY displayOrder ASC").all();
  res.json({ categories: cats });
});

app.post("/api/categories", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, slug, icon, image, displayOrder } = req.body;
    if (!name || !slug) return res.status(400).json({ error: "Name and slug are required" });
    const id = slug;
    db.prepare(
      "INSERT INTO categories (id, name, slug, icon, image, displayOrder) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, name, slug, icon || "", image || "", displayOrder || 0);
    res.status(201).json({ id, name, slug });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.put("/api/categories/:id", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, icon, image, displayOrder } = req.body;
    db.prepare(
      "UPDATE categories SET name = COALESCE(?, name), icon = COALESCE(?, icon), image = COALESCE(?, image), displayOrder = COALESCE(?, displayOrder) WHERE id = ?"
    ).run(name, icon, image, displayOrder, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

app.delete("/api/categories/:id", authMiddleware, adminMiddleware, (req, res) => {
  try {
    db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ═══════════════════════════════════════════════════════════
// PRODUCTS ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/api/products", (req, res) => {
  const { category, search, featured, bestSeller, newArrival, limit, offset } = req.query;
  let sql = "SELECT * FROM products WHERE active = 1";
  const params = [];

  if (category) { sql += " AND category = ?"; params.push(category); }
  if (featured === "true") { sql += " AND featured = 1"; }
  if (bestSeller === "true") { sql += " AND bestSeller = 1"; }
  if (newArrival === "true") { sql += " AND newArrival = 1"; }
  if (search) {
    sql += " AND (name LIKE ? OR description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY created_at DESC";
  if (limit) { sql += " LIMIT ?"; params.push(Number(limit)); }
  if (offset) { sql += " OFFSET ?"; params.push(Number(offset)); }

  const products = db.prepare(sql).all(...params);
  products.forEach(p => { p.images = JSON.parse(p.images || "[]"); });

  const countSql = sql.replace(/SELECT \*/, "SELECT COUNT(*) as total").replace(/ LIMIT.*/, "");
  const countParams = params.slice(0, params.length - (limit ? 1 : 0) - (offset ? 1 : 0));

  res.json({ products, total: products.length });
});

app.get("/api/products/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  product.images = JSON.parse(product.images || "[]");
  res.json({ product });
});

app.post("/api/products", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, category, weight, purity, makingCharges, description, images, featured, bestSeller, newArrival } = req.body;
    if (!name || !category || !weight) {
      return res.status(400).json({ error: "Name, category, and weight are required" });
    }
    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(
      `INSERT INTO products (id, name, category, weight, purity, makingCharges, description, images, featured, bestSeller, newArrival)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, name, category, weight, purity || "22K", makingCharges || 0,
      description || "", JSON.stringify(images || []), featured ? 1 : 0, bestSeller ? 1 : 0, newArrival ? 1 : 0
    );
    res.status(201).json({ id, name });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, category, weight, purity, makingCharges, description, images, featured, bestSeller, newArrival, active } = req.body;
    const sets = [];
    const params = [];
    if (name !== undefined) { sets.push("name = ?"); params.push(name); }
    if (category !== undefined) { sets.push("category = ?"); params.push(category); }
    if (weight !== undefined) { sets.push("weight = ?"); params.push(weight); }
    if (purity !== undefined) { sets.push("purity = ?"); params.push(purity); }
    if (makingCharges !== undefined) { sets.push("makingCharges = ?"); params.push(makingCharges); }
    if (description !== undefined) { sets.push("description = ?"); params.push(description); }
    if (images !== undefined) { sets.push("images = ?"); params.push(JSON.stringify(images)); }
    if (featured !== undefined) { sets.push("featured = ?"); params.push(featured ? 1 : 0); }
    if (bestSeller !== undefined) { sets.push("bestSeller = ?"); params.push(bestSeller ? 1 : 0); }
    if (newArrival !== undefined) { sets.push("newArrival = ?"); params.push(newArrival ? 1 : 0); }
    if (active !== undefined) { sets.push("active = ?"); params.push(active ? 1 : 0); }
    sets.push("updated_at = datetime('now')");
    params.push(req.params.id);
    db.prepare(`UPDATE products SET ${sets.join(", ")} WHERE id = ?`).run(...params);
    res.json({ success: true });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", authMiddleware, adminMiddleware, (req, res) => {
  try {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ═══════════════════════════════════════════════════════════
// ORDERS ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/api/orders", (req, res) => {
  try {
    const { items, subtotal, shipping, tax, total, shippingAddress, contactInfo, paymentMethod, userId } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: "No items in order" });
    if (!contactInfo?.name || !contactInfo?.phone) return res.status(400).json({ error: "Contact info required" });

    const id = crypto.randomUUID();
    const orderNumber = generateOrderNumber();

    db.prepare(
      `INSERT INTO orders (id, orderNumber, userId, items, subtotal, shipping, tax, total, shippingAddress, contactInfo, paymentMethod)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, orderNumber, userId || null, JSON.stringify(items),
      subtotal || 0, shipping || 0, tax || 0, total || 0,
      JSON.stringify(shippingAddress || {}), JSON.stringify(contactInfo || {}),
      paymentMethod || "cod"
    );

    res.status(201).json({ id, orderNumber });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders", authMiddleware, (req, res) => {
  const orders = db.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY created_at DESC").all(req.user.id);
  orders.forEach(o => {
    o.items = JSON.parse(o.items || "[]");
    o.shippingAddress = JSON.parse(o.shippingAddress || "{}");
    o.contactInfo = JSON.parse(o.contactInfo || "{}");
  });
  res.json({ orders });
});

app.get("/api/orders/:id", authMiddleware, (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ? OR orderNumber = ?").get(req.params.id, req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (req.user.role !== "admin" && order.userId !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }
  order.items = JSON.parse(order.items || "[]");
  order.shippingAddress = JSON.parse(order.shippingAddress || "{}");
  order.contactInfo = JSON.parse(order.contactInfo || "{}");
  res.json({ order });
});

// ═══════════════════════════════════════════════════════════
// WISHLIST ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/api/wishlist", authMiddleware, (req, res) => {
  const items = db.prepare(
    `SELECT w.*, p.name, p.category, p.weight, p.makingCharges, p.images, p.purity
     FROM wishlist w JOIN products p ON w.productId = p.id WHERE w.userId = ?`
  ).all(req.user.id);
  items.forEach(i => { i.images = JSON.parse(i.images || "[]"); });
  res.json({ wishlist: items });
});

app.post("/api/wishlist", authMiddleware, (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "Product ID required" });
    db.prepare("INSERT OR IGNORE INTO wishlist (userId, productId) VALUES (?, ?)").run(req.user.id, productId);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

app.delete("/api/wishlist/:productId", authMiddleware, (req, res) => {
  db.prepare("DELETE FROM wishlist WHERE userId = ? AND productId = ?").run(req.user.id, req.params.productId);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// CONTACT ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/api/contact", (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: "Name and message are required" });
    db.prepare(
      "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)"
    ).run(name, email || "", phone || "", subject || "", message);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ═══════════════════════════════════════════════════════════
// SETTINGS ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/api/settings", (req, res) => {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json({ settings });
});

app.put("/api/settings", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { settings } = req.body;
    const upsert = db.prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
    );
    const batch = db.transaction((entries) => {
      for (const [key, value] of entries) {
        upsert.run(key, String(value));
      }
    });
    batch(Object.entries(settings));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// ═══════════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════════

app.get("/api/search", (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ products: [] });
  const products = db.prepare(
    "SELECT * FROM products WHERE active = 1 AND (name LIKE ? OR description LIKE ? OR category LIKE ?) LIMIT 20"
  ).all(`%${q}%`, `%${q}%`, `%${q}%`);
  products.forEach(p => { p.images = JSON.parse(p.images || "[]"); });
  res.json({ products });
});

// ═══════════════════════════════════════════════════════════
// TESTIMONIALS & REVIEWS
// ═══════════════════════════════════════════════════════════

app.get("/api/testimonials", (req, res) => {
  const reviews = db.prepare("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC").all();
  const videos = db.prepare("SELECT * FROM feedback_videos ORDER BY displayOrder ASC, created_at DESC").all();
  res.json({ reviews, videos });
});

app.post("/api/reviews", authMiddleware, (req, res) => {
  try {
    const { rating, text } = req.body;
    if (!rating || !text) return res.status(400).json({ error: "Rating and text are required" });
    db.prepare("INSERT INTO reviews (userId, userName, rating, text) VALUES (?, ?, ?, ?)").run(
      req.user.id,
      req.user.name || "Customer",
      rating,
      text
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// ═══════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════

app.get("/api/gallery", (req, res) => {
  const photos = db.prepare("SELECT * FROM gallery ORDER BY displayOrder ASC, created_at DESC").all();
  res.json({ photos });
});

// ═══════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════

// Admin Reviews
app.get("/api/admin/reviews", authMiddleware, adminMiddleware, (req, res) => {
  const reviews = db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all();
  res.json({ reviews });
});

app.put("/api/admin/reviews/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.prepare("UPDATE reviews SET status = ? WHERE id = ?").run(req.body.status, req.params.id);
  res.json({ success: true });
});

app.delete("/api/admin/reviews/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.prepare("DELETE FROM reviews WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Admin Videos
app.post("/api/admin/videos", authMiddleware, adminMiddleware, (req, res) => {
  const { videoUrl, thumbnailUrl, caption, displayOrder } = req.body;
  if (!videoUrl) return res.status(400).json({ error: "Video URL required" });
  db.prepare("INSERT INTO feedback_videos (videoUrl, thumbnailUrl, caption, displayOrder) VALUES (?, ?, ?, ?)").run(
    videoUrl, thumbnailUrl || "", caption || "", displayOrder || 0
  );
  res.status(201).json({ success: true });
});

app.delete("/api/admin/videos/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.prepare("DELETE FROM feedback_videos WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Admin Gallery
app.post("/api/admin/gallery", authMiddleware, adminMiddleware, (req, res) => {
  const { imageUrl, jewelryName, displayOrder } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "Image URL required" });
  db.prepare("INSERT INTO gallery (imageUrl, jewelryName, displayOrder) VALUES (?, ?, ?)").run(
    imageUrl, jewelryName || "", displayOrder || 0
  );
  res.status(201).json({ success: true });
});

app.delete("/api/admin/gallery/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.prepare("DELETE FROM gallery WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/admin/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products WHERE active = 1").get().count;
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
    const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE status != 'cancelled'").get().sum;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get().count;
    const unreadMessages = db.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE read = 0").get().count;

    const recentOrders = db.prepare(
      "SELECT id, orderNumber, total, status, contactInfo, created_at FROM orders ORDER BY created_at DESC LIMIT 10"
    ).all();
    recentOrders.forEach(o => { o.contactInfo = JSON.parse(o.contactInfo || "{}"); });

    res.json({
      stats: { totalProducts, totalOrders, totalCustomers, totalRevenue, pendingOrders, unreadMessages },
      recentOrders,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

app.get("/api/admin/orders", authMiddleware, adminMiddleware, (req, res) => {
  const { status, limit, offset } = req.query;
  let sql = "SELECT * FROM orders";
  const params = [];
  if (status) { sql += " WHERE status = ?"; params.push(status); }
  sql += " ORDER BY created_at DESC";
  if (limit) { sql += " LIMIT ?"; params.push(Number(limit)); }
  if (offset) { sql += " OFFSET ?"; params.push(Number(offset)); }

  const orders = db.prepare(sql).all(...params);
  orders.forEach(o => {
    o.items = JSON.parse(o.items || "[]");
    o.shippingAddress = JSON.parse(o.shippingAddress || "{}");
    o.contactInfo = JSON.parse(o.contactInfo || "{}");
  });
  res.json({ orders });
});

app.put("/api/admin/orders/:id", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { status, trackingNumber, notes, paymentStatus } = req.body;
    const sets = ["updated_at = datetime('now')"];
    const params = [];
    if (status) { sets.push("status = ?"); params.push(status); }
    if (trackingNumber !== undefined) { sets.push("trackingNumber = ?"); params.push(trackingNumber); }
    if (notes !== undefined) { sets.push("notes = ?"); params.push(notes); }
    if (paymentStatus) { sets.push("paymentStatus = ?"); params.push(paymentStatus); }
    params.push(req.params.id);
    db.prepare(`UPDATE orders SET ${sets.join(", ")} WHERE id = ?`).run(...params);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.get("/api/admin/customers", authMiddleware, adminMiddleware, (req, res) => {
  const customers = db.prepare(
    `SELECT u.id, u.name, u.email, u.phone, u.created_at,
      (SELECT COUNT(*) FROM orders WHERE userId = u.id) as orderCount,
      (SELECT COALESCE(SUM(total), 0) FROM orders WHERE userId = u.id) as totalSpent
     FROM users u WHERE u.role = 'customer' ORDER BY u.created_at DESC`
  ).all();
  res.json({ customers });
});

app.get("/api/admin/messages", authMiddleware, adminMiddleware, (req, res) => {
  const messages = db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all();
  res.json({ messages });
});

app.put("/api/admin/messages/:id/read", authMiddleware, adminMiddleware, (req, res) => {
  db.prepare("UPDATE contact_messages SET read = 1 WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.delete("/api/admin/messages/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.prepare("DELETE FROM contact_messages WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Admin products (includes inactive)
app.get("/api/admin/products", authMiddleware, adminMiddleware, (req, res) => {
  const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  products.forEach(p => { p.images = JSON.parse(p.images || "[]"); });
  res.json({ products });
});

// ═══════════════════════════════════════════════════════════
// PRODUCTION SETUP (SERVE FRONTEND)
// ═══════════════════════════════════════════════════════════

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "production_simulation") {
  app.use(express.static(path.join(__dirname, "..", "dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
  });
}

// ─── Start Server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Aurum Jewels API running on http://localhost:${PORT}`);
});
