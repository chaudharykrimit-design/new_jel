import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, categories, calculatePrice } from "@/data/products";
import { useGoldRates } from "@/contexts/GoldRateContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { motion, AnimatePresence } from "framer-motion";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Weight: Light to Heavy", value: "weight-asc" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [sort, setSort] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500000]);
  const { rates } = useGoldRates();

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    result = result.filter((p) => {
      const price = calculatePrice(p.weight, p.makingCharges, rates.gold22k).total;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => calculatePrice(a.weight, a.makingCharges, rates.gold22k).total - calculatePrice(b.weight, b.makingCharges, rates.gold22k).total);
        break;
      case "price-desc":
        result.sort((a, b) => calculatePrice(b.weight, b.makingCharges, rates.gold22k).total - calculatePrice(a.weight, a.makingCharges, rates.gold22k).total);
        break;
      case "weight-asc":
        result.sort((a, b) => a.weight - b.weight);
        break;
    }
    return result;
  }, [activeCategory, sort, priceRange, rates.gold22k]);

  const setCategory = (cat: string) => {
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Breadcrumb */}
      <div className="bg-cream py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">{activeCategory ? categories.find(c => c.id === activeCategory)?.name || "Products" : "All Products"}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground">
              {activeCategory ? categories.find(c => c.id === activeCategory)?.name : "All Jewelry"}
            </h1>
            <p className="text-muted-foreground text-sm font-body mt-1">{filtered.length} pieces</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-wider uppercase font-body hover:border-primary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-background border border-border px-4 py-2 pr-8 text-xs tracking-wider font-body hover:border-primary transition-colors cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-body font-medium border transition-colors ${
              !activeCategory ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground/70 hover:border-primary"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-body font-medium border transition-colors ${
                activeCategory === cat.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground/70 hover:border-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Drawer */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="border border-border p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="font-body text-xs tracking-wider uppercase font-semibold mb-3">Price Range</h4>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="border border-border px-3 py-2 text-xs font-body w-28 bg-background"
                    />
                    <span className="text-muted-foreground text-xs">to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="border border-border px-3 py-2 text-xs font-body w-28 bg-background"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => { setPriceRange([0, 1500000]); setIsFilterOpen(false); }}
                    className="flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-primary transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-xl text-foreground/50">No products found</p>
            <p className="text-muted-foreground text-sm font-body mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
