import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import type { Order } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const OrderConfirmation = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderNumber) {
      api.orders.get(orderNumber).then(({ order }) => setOrder(order)).catch(() => {});
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="font-display text-3xl text-foreground mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground font-body mb-2">Thank you for your order. We'll contact you shortly.</p>

          {orderNumber && (
            <div className="inline-flex items-center gap-2 bg-cream border border-border px-5 py-3 mt-4 mb-8">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm font-body">
                Order Number: <span className="font-semibold text-foreground">{orderNumber}</span>
              </span>
            </div>
          )}

          {order && (
            <div className="border border-border p-6 text-left mb-8">
              <h3 className="font-display text-sm text-foreground mb-4">Order Details</h3>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm font-body">
                    <span className="text-foreground/70">{item.name} ×{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                  <span className="font-body text-sm">Total</span>
                  <span className="font-display text-primary">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground font-body">Payment: Cash on Delivery</p>
                <p className="text-xs text-muted-foreground font-body">Status: <span className="text-primary font-semibold capitalize">{order.status}</span></p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.15em] uppercase font-body font-semibold hover:bg-gold-dark transition-colors">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/account" className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-3 text-xs tracking-[0.15em] uppercase font-body font-medium hover:border-primary hover:text-primary transition-colors">
              View Orders
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
