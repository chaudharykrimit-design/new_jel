import { Link } from "react-router-dom";
import { getFeaturedProducts, getBestSellers } from "@/data/products";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellers();

  return (
    <>
      {/* Featured */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-body font-medium">
              Curated For You
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">
              Featured Collection
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block border border-primary text-primary px-10 py-3 text-xs tracking-[0.2em] uppercase font-body font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-cream">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-body font-medium">
              Most Loved
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">
              Bestsellers
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;
