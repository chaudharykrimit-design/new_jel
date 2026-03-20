import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import { useAuth } from "@/contexts/AuthContext";
import { calculatePrice } from "@/data/products";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { rates } = useGoldRates();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    address: "", city: "", state: "", pincode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map(item => {
        const p = calculatePrice(item.product.weight, item.product.makingCharges, rates.gold22k);
        return {
          productId: item.product.id,
          name: item.product.name,
          category: item.product.category,
          weight: item.product.weight,
          makingCharges: item.product.makingCharges,
          quantity: item.quantity,
          price: p.total,
        };
      });

      const { orderNumber } = await api.orders.create({
        items: orderItems,
        subtotal: totalPrice,
        shipping: 0,
        tax: 0,
        total: totalPrice,
        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        contactInfo: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        paymentMethod: "cod",
        userId: user?.id,
      });

      clearCart();
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh] text-center">
          <div>
            <p className="font-display text-xl text-foreground/50 mb-3">No items to checkout</p>
            <Link to="/products" className="text-primary text-sm font-body hover:underline">Shop Now</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inputClass = "w-full border border-border bg-background px-4 py-3 text-sm font-body focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-display text-lg text-foreground mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Full Name *</label>
                    <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Phone *</label>
                    <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Email</label>
                    <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg text-foreground mb-4">Shipping Address</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Address *</label>
                    <textarea className={`${inputClass} resize-none h-20`} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">City *</label>
                    <input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">State</label>
                    <input className={inputClass} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Pincode *</label>
                    <input className={inputClass} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg text-foreground mb-4">Payment Method</h3>
                <div className="border border-primary bg-primary/5 p-4 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-semibold text-foreground">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground font-body">Pay when your order arrives</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="border border-border p-6 sticky top-24">
                <h3 className="font-display text-lg text-foreground mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {items.map((item) => {
                    const price = calculatePrice(item.product.weight, item.product.makingCharges, rates.gold22k);
                    return (
                      <div key={item.product.id} className="flex justify-between text-sm font-body">
                        <span className="text-foreground/70 truncate max-w-[60%]">
                          {item.product.name} ×{item.quantity}
                        </span>
                        <span className="text-foreground">₹{(price.total * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-foreground/70">Subtotal</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-foreground/70">Shipping</span>
                    <span className="text-primary text-xs font-semibold">FREE</span>
                  </div>
                </div>
                <div className="border-t border-border pt-3 flex justify-between mb-5">
                  <span className="font-body font-semibold text-foreground">Total</span>
                  <span className="font-display text-xl text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3.5 text-xs tracking-[0.2em] uppercase font-body font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
