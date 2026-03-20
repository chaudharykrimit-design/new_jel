import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/products";

const categoryImages: Record<string, string> = {
  rings: "💍",
  earrings: "✨",
  necklaces: "📿",
  bangles: "⭕",
  bracelets: "🔗",
  chains: "⛓️",
  pendants: "💎",
};

const CategoriesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary text-xs tracking-[0.3em] uppercase font-body font-medium">
            Our Collections
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">
            Shop by Category
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-cream border border-border flex items-center justify-center text-3xl md:text-4xl group-hover:border-primary group-hover:shadow-[var(--shadow-gold)] transition-all duration-500">
                  {categoryImages[cat.id]}
                </div>
                <span className="mt-3 text-xs tracking-[0.15em] uppercase font-body font-medium text-foreground/80 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
