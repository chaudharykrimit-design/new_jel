import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Order } from "@/lib/api";
import { toast } from "sonner";
import { Eye, X } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const allStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const load = () => {
    const params = filter ? { status: filter } : undefined;
    api.admin.orders(params).then(({ orders }) => setOrders(orders));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.admin.updateOrder(id, { status });
      toast.success(`Order status updated to ${status}`);
      load();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-foreground">Orders</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("")}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-body border transition-colors ${!filter ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground/60 hover:border-primary"}`}
          >
            All
          </button>
          {allStatuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-body border transition-colors ${filter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground/60 hover:border-primary"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-background border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg">Order #{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm font-body">
                <div><span className="text-muted-foreground text-xs uppercase">Status</span>
                  <select
                    className="w-full border border-border bg-background px-3 py-2 text-sm font-body mt-1"
                    value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value)}
                  >
                    {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><span className="text-muted-foreground text-xs uppercase">Payment</span><p className="mt-1 capitalize">{selected.paymentMethod}</p></div>
              </div>

              <div className="text-sm font-body">
                <span className="text-muted-foreground text-xs uppercase">Customer</span>
                <p>{selected.contactInfo?.name}</p>
                <p className="text-foreground/60">{selected.contactInfo?.phone}</p>
                <p className="text-foreground/60">{selected.contactInfo?.email}</p>
              </div>

              <div className="text-sm font-body">
                <span className="text-muted-foreground text-xs uppercase">Shipping Address</span>
                <p>{selected.shippingAddress?.address}</p>
                <p className="text-foreground/60">{selected.shippingAddress?.city}, {selected.shippingAddress?.state} {selected.shippingAddress?.pincode}</p>
              </div>

              <div>
                <span className="text-muted-foreground text-xs uppercase font-body">Items</span>
                <div className="mt-2 space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm font-body">
                      <span>{item.name} ×{item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold font-body text-sm">
                  <span>Total</span>
                  <span className="text-primary">₹{selected.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-body">
                Placed: {new Date(selected.created_at).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Order #</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Customer</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Items</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date</th>
              <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-semibold">{order.orderNumber}</td>
                <td className="px-5 py-3 text-foreground/70">{order.contactInfo?.name || "—"}</td>
                <td className="px-5 py-3">{order.items?.length || 0}</td>
                <td className="px-5 py-3">₹{order.total.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] px-2.5 py-1 uppercase tracking-wider font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-foreground/70">{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setSelected(order)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm font-body">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
