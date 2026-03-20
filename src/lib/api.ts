// ─── Centralized API Client ────────────────────────────────
const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("aurum_token");
}

export function setToken(token: string) {
  localStorage.setItem("aurum_token", token);
}

export function clearToken() {
  localStorage.removeItem("aurum_token");
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Set json content type by default unless body is FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  } else if (!options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API Error ${res.status}`);
  }

  return res.json();
}

// ─── Auth ──────────────────────────────────────────────────
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: User; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { name: string; email: string; password: string; phone?: string }) =>
      request<{ user: User; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<{ user: User }>("/auth/me"),
    updateProfile: (data: Partial<User>) =>
      request<{ user: User }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // ─── Products ────────────────────────────────────────────
  products: {
    list: (params?: Record<string, string>) => {
      const q = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<{ products: Product[]; total: number }>(`/products${q}`);
    },
    get: (id: string) => request<{ product: Product }>(`/products/${id}`),
    create: (data: Partial<Product>) =>
      request("/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Product>) =>
      request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/products/${id}`, { method: "DELETE" }),
    search: (q: string) => request<{ products: Product[] }>(`/search?q=${encodeURIComponent(q)}`),
  },

  // ─── Categories ──────────────────────────────────────────
  categories: {
    list: () => request<{ categories: Category[] }>("/categories"),
    create: (data: Partial<Category>) =>
      request("/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Category>) =>
      request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/categories/${id}`, { method: "DELETE" }),
  },

  // ─── Orders ──────────────────────────────────────────────
  orders: {
    create: (data: OrderCreateData) =>
      request<{ id: string; orderNumber: string }>("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    list: () => request<{ orders: Order[] }>("/orders"),
    get: (id: string) => request<{ order: Order }>(`/orders/${id}`),
  },

  // ─── Wishlist ────────────────────────────────────────────
  wishlist: {
    list: () => request<{ wishlist: WishlistItem[] }>("/wishlist"),
    add: (productId: string) =>
      request("/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
    remove: (productId: string) =>
      request(`/wishlist/${productId}`, { method: "DELETE" }),
  },

  // ─── Contact ─────────────────────────────────────────────
  contact: {
    send: (data: { name: string; email?: string; phone?: string; subject?: string; message: string }) =>
      request("/contact", { method: "POST", body: JSON.stringify(data) }),
  },

  // ─── Testimonials & Reviews ──────────────────────────────
  testimonials: {
    get: () => request<{ reviews: Review[]; videos: FeedbackVideo[] }>("/testimonials"),
    submitReview: (data: { rating: number; text: string }) =>
      request("/reviews", { method: "POST", body: JSON.stringify(data) }),
  },

  // ─── Gallery ─────────────────────────────────────────────
  gallery: {
    get: () => request<{ photos: GalleryPhoto[] }>("/gallery"),
  },

  // ─── Uploads ─────────────────────────────────────────────
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
    });
  },

  // ─── Settings ────────────────────────────────────────────
  settings: {
    get: () => request<{ settings: Record<string, string> }>("/settings"),
    update: (settings: Record<string, string>) =>
      request("/settings", { method: "PUT", body: JSON.stringify({ settings }) }),
  },

  // ─── Admin ───────────────────────────────────────────────
  admin: {
    dashboard: () => request<DashboardData>("/admin/dashboard"),
    orders: (params?: Record<string, string>) => {
      const q = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<{ orders: Order[] }>(`/admin/orders${q}`);
    },
    updateOrder: (id: string, data: Partial<Order>) =>
      request(`/admin/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    customers: () => request<{ customers: Customer[] }>("/admin/customers"),
    messages: () => request<{ messages: ContactMessage[] }>("/admin/messages"),
    markMessageRead: (id: number) =>
      request(`/admin/messages/${id}/read`, { method: "PUT" }),
    deleteMessage: (id: number) =>
      request(`/admin/messages/${id}`, { method: "DELETE" }),
    products: () => request<{ products: Product[] }>("/admin/products"),
    
    // Admin Reviews
    reviews: () => request<{ reviews: Review[] }>("/admin/reviews"),
    updateReview: (id: number, status: string) =>
      request(`/admin/reviews/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
    deleteReview: (id: number) =>
      request(`/admin/reviews/${id}`, { method: "DELETE" }),
      
    // Admin Videos
    createVideo: (data: Partial<FeedbackVideo>) =>
      request("/admin/videos", { method: "POST", body: JSON.stringify(data) }),
    deleteVideo: (id: number) =>
      request(`/admin/videos/${id}`, { method: "DELETE" }),
      
    // Admin Gallery
    createGalleryPhoto: (data: Partial<GalleryPhoto>) =>
      request("/admin/gallery", { method: "POST", body: JSON.stringify(data) }),
    deleteGalleryPhoto: (id: number) =>
      request(`/admin/gallery/${id}`, { method: "DELETE" }),
  },
};

// ─── Types ─────────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  addresses?: Address[];
  created_at?: string;
};

export type Address = {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  weight: number;
  purity: string;
  makingCharges: number;
  description: string;
  images: string[];
  featured: number | boolean;
  bestSeller: number | boolean;
  newArrival: number | boolean;
  active: number | boolean;
  created_at?: string;
  updated_at?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  displayOrder: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  shippingAddress: Address;
  contactInfo: { name: string; email: string; phone: string };
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  category: string;
  weight: number;
  makingCharges: number;
  quantity: number;
  price: number;
};

export type OrderCreateData = {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Partial<Address>;
  contactInfo: { name: string; email?: string; phone: string };
  paymentMethod: string;
  userId?: string;
};

export type DashboardData = {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    pendingOrders: number;
    unreadMessages: number;
  };
  recentOrders: Order[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  orderCount: number;
  totalSpent: number;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: number;
  created_at: string;
};

export type WishlistItem = {
  id: number;
  userId: string;
  productId: string;
  name: string;
  category: string;
  weight: number;
  makingCharges: number;
  images: string[];
  purity: string;
  created_at: string;
};

export type Review = {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  status: string;
  created_at: string;
};

export type FeedbackVideo = {
  id: number;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  displayOrder: number;
  created_at: string;
};

export type GalleryPhoto = {
  id: number;
  imageUrl: string;
  jewelryName: string;
  displayOrder: number;
  created_at: string;
};
