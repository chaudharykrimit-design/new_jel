import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import { calculatePrice } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { rates } = useGoldRates();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-xl text-foreground/50 mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary text-sm font-body hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = calculatePrice(item.product.weight, item.product.makingCharges, rates.gold22k);
                return (
                  <div key={item.product.id} className="flex gap-4 md:gap-6 p-4 border border-border/50">
                    <div className="w-24 h-28 bg-cream flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl opacity-20">💍</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link to={`/product/${item.product.id}`} className="font-display text-sm text-foreground hover:text-primary transition-colors">
                            {item.product.name}
                          </Link>
                          <p className="text-muted-foreground text-[10px] font-body uppercase tracking-wider mt-0.5">
                            {item.product.category} · {item.product.weight}g
                          </p>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-border">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 hover:bg-muted transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 text-xs font-body">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 hover:bg-muted transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-body font-semibold text-foreground">
                          ₹{(price.total * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={clearCart}
                className="text-xs font-body text-muted-foreground hover:text-destructive transition-colors tracking-wider uppercase"
              >
                Clear All
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border p-6 sticky top-24">
                <h3 className="font-display text-lg text-foreground mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-foreground/70">Subtotal ({items.length} items)</span>
                    <span className="text-foreground">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-foreground/70">Shipping</span>
                    <span className="text-primary text-xs font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-body font-semibold text-foreground">Total</span>
                    <span className="font-display text-xl text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block text-center bg-primary text-primary-foreground py-3.5 text-xs tracking-[0.2em] uppercase font-body font-semibold hover:bg-gold-dark transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="block text-center mt-3 text-xs font-body text-muted-foreground hover:text-primary transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
