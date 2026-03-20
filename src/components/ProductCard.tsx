import { Link } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import { Product, calculatePrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import { motion } from "framer-motion";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCart();
  const { rates } = useGoldRates();
  const price = calculatePrice(product.weight, product.makingCharges, rates.gold22k);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group"
    >
      <div className="luxury-card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-cream overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="w-full h-full gold-gradient rounded-sm opacity-10" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30">
              {product.category === "rings" ? "💍" :
               product.category === "earrings" ? "✨" :
               product.category === "necklaces" ? "📿" :
               product.category === "bangles" ? "⭕" :
               product.category === "bracelets" ? "🔗" :
               product.category === "chains" ? "⛓️" : "💎"}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.newArrival && (
              <span className="bg-primary text-primary-foreground text-[9px] tracking-wider uppercase px-2.5 py-1 font-body font-semibold">
                New
              </span>
            )}
            {product.bestSeller && (
              <span className="bg-secondary text-secondary-foreground text-[9px] tracking-wider uppercase px-2.5 py-1 font-body font-semibold">
                Bestseller
              </span>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-x-0 bottom-0 flex gap-1 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="flex-1 bg-secondary text-secondary-foreground py-2.5 text-[10px] tracking-wider uppercase font-body font-medium flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
            </button>
            <Link
              to={`/product/${product.id}`}
              className="bg-secondary text-secondary-foreground p-2.5 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] tracking-[0.15em] uppercase text-primary font-body font-medium mb-1">
            {product.category}
          </p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-sm md:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-body font-semibold text-foreground text-sm">
              ₹{price.total.toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground text-[10px] font-body">
              {product.weight}g
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
