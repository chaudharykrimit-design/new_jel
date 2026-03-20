import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { DashboardData } from "@/lib/api";
import { Package, ShoppingCart, Users, IndianRupee, Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.admin.dashboard().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return <div className="flex items-center justify-center h-64"><span className="text-muted-foreground font-body text-sm">Loading dashboard...</span></div>;
  }

  const stats = [
    { label: "Total Products", value: data.stats.totalProducts, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Total Orders", value: data.stats.totalOrders, icon: ShoppingCart, color: "bg-green-50 text-green-600" },
    { label: "Customers", value: data.stats.totalCustomers, icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Revenue", value: `₹${data.stats.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "bg-amber-50 text-amber-600" },
    { label: "Pending Orders", value: data.stats.pendingOrders, icon: Clock, color: "bg-orange-50 text-orange-600" },
    { label: "Unread Messages", value: data.stats.unreadMessages, icon: MessageSquare, color: "bg-red-50 text-red-600" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-background border border-border p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="font-display text-2xl text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground font-body tracking-wider uppercase mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-background border border-border">
        <div className="p-5 border-b border-border">
          <h2 className="font-display text-lg text-foreground">Recent Orders</h2>
        </div>
        {data.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm font-body">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Order #</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-semibold">{order.orderNumber}</td>
                    <td className="px-5 py-3 text-foreground/70">{order.contactInfo?.name || "—"}</td>
                    <td className="px-5 py-3">₹{order.total.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2.5 py-1 uppercase tracking-wider font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-foreground/70">{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
