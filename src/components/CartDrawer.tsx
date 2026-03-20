import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import { calculatePrice } from "@/data/products";
import { AnimatePresence, motion } from "framer-motion";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { rates } = useGoldRates();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Shopping Bag
                <span className="text-muted-foreground text-sm font-body">({items.length})</span>
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="font-display text-lg text-foreground/60">Your bag is empty</p>
                  <p className="text-muted-foreground text-xs font-body mt-1">Add something beautiful!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => {
                    const price = calculatePrice(item.product.weight, item.product.makingCharges, rates.gold22k);
                    return (
                      <div key={item.product.id} className="flex gap-4 pb-4 border-b border-border/50">
                        <div className="w-20 h-24 bg-cream flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl opacity-30">💍</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-sm text-foreground truncate">{item.product.name}</h4>
                          <p className="text-muted-foreground text-[10px] font-body uppercase tracking-wider mt-0.5">
                            {item.product.category} · {item.product.weight}g
                          </p>
                          <p className="text-foreground font-body font-semibold text-sm mt-1">
                            ₹{(price.total * item.quantity).toLocaleString("en-IN")}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-muted transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 text-xs font-body">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-muted transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-foreground/80">Subtotal</span>
                  <span className="font-display text-lg text-foreground">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-muted-foreground text-[10px] font-body">Shipping & taxes calculated at checkout</p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block text-center bg-primary text-primary-foreground py-3 text-xs tracking-[0.2em] uppercase font-body font-semibold hover:bg-gold-dark transition-colors"
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="block text-center border border-foreground/20 text-foreground py-3 text-xs tracking-[0.2em] uppercase font-body font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
