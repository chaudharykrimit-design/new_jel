import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { Order } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, User, LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Account = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      api.orders.list().then(({ orders }) => setOrders(orders)).catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) return null;

  const handleLogout = () => { logout(); navigate("/"); };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl md:text-3xl text-foreground">My Account</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-body text-muted-foreground hover:text-destructive transition-colors uppercase tracking-wider">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-border p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-sm text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {[
                  { key: "orders" as const, label: "My Orders", icon: Package },
                  { key: "profile" as const, label: "Profile", icon: User },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs tracking-wider uppercase font-body transition-colors ${
                      activeTab === item.key ? "text-primary bg-primary/5 font-semibold" : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" /> {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-lg text-foreground mb-5">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-16 border border-border">
                    <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="font-display text-foreground/50 mb-2">No orders yet</p>
                    <Link to="/products" className="text-primary text-sm font-body hover:underline">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-border p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <span className="text-xs text-muted-foreground font-body">Order </span>
                            <span className="font-body font-semibold text-sm">{order.orderNumber}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] px-2.5 py-1 uppercase tracking-wider font-body font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                              {order.status}
                            </span>
                            <span className="text-xs text-muted-foreground font-body">
                              {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex justify-between text-sm font-body">
                              <span className="text-foreground/70">{item.name} ×{item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-muted-foreground font-body">+{order.items.length - 3} more items</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-3">
                          <span className="font-display text-primary">₹{order.total.toLocaleString("en-IN")}</span>
                          {order.trackingNumber && (
                            <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                              Tracking: {order.trackingNumber} <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-lg text-foreground mb-5">Profile Details</h2>
                <div className="border border-border p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-body uppercase tracking-wider text-muted-foreground">Name</span>
                      <p className="text-sm font-body text-foreground mt-1">{user.name}</p>
                    </div>
                    <div>
                      <span className="text-xs font-body uppercase tracking-wider text-muted-foreground">Email</span>
                      <p className="text-sm font-body text-foreground mt-1">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-xs font-body uppercase tracking-wider text-muted-foreground">Phone</span>
                      <p className="text-sm font-body text-foreground mt-1">{user.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-xs font-body uppercase tracking-wider text-muted-foreground">Member Since</span>
                      <p className="text-sm font-body text-foreground mt-1">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
