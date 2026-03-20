import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import hero4 from "@/assets/hero-4.jpg";

const PromoBanners = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/products?category=necklaces" className="group block relative overflow-hidden h-64 md:h-80">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${hero1})` }}
              />
              <div className="absolute inset-0 bg-secondary/60" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                <span className="text-primary text-xs tracking-[0.3em] uppercase font-body">Flat 20% Off</span>
                <h3 className="font-display text-2xl md:text-3xl text-secondary-foreground mt-2">
                  Wedding Collection
                </h3>
                <span className="mt-4 border-b border-primary text-primary text-xs tracking-widest uppercase font-body pb-1">
                  Shop Now
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/products?category=bangles" className="group block relative overflow-hidden h-64 md:h-80">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${hero4})` }}
              />
              <div className="absolute inset-0 bg-secondary/60" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                <span className="text-primary text-xs tracking-[0.3em] uppercase font-body">New Arrivals</span>
                <h3 className="font-display text-2xl md:text-3xl text-secondary-foreground mt-2">
                  Artisan Bangles
                </h3>
                <span className="mt-4 border-b border-primary text-primary text-xs tracking-widest uppercase font-body pb-1">
                  Discover
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
