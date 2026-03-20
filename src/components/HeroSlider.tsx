import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";

const slides = [
  {
    image: hero1,
    subtitle: "The Heritage Collection",
    title: "Timeless Elegance",
    description: "Discover masterfully crafted pieces that celebrate centuries of artistry",
    cta: "Explore Collection",
    link: "/products?category=necklaces",
  },
  {
    image: hero2,
    subtitle: "Bridal Luxuries",
    title: "Your Special Day",
    description: "Exquisite bridal sets handcrafted with love and tradition",
    cta: "Shop Bridal",
    link: "/products?category=necklaces",
  },
  {
    image: hero3,
    subtitle: "New Arrivals",
    title: "Modern Classics",
    description: "Contemporary designs that blend heritage with modern sophistication",
    cta: "View New Arrivals",
    link: "/products?category=rings",
  },
  {
    image: hero4,
    subtitle: "Handcrafted Bangles",
    title: "Tradition Refined",
    description: "Each bangle tells a story of artisanal excellence",
    cta: "Shop Bangles",
    link: "/products?category=bangles",
  },
  {
    image: hero5,
    subtitle: "Exclusive Offers",
    title: "Festive Season Sale",
    description: "Flat 20% off on making charges — limited time only",
    cta: "Shop Now",
    link: "/products",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[current];

  return (
    <section className="relative h-[60vh] md:h-[85vh] overflow-hidden bg-secondary">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 ken-burns bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-xl"
            >
              <span className="text-primary text-xs md:text-sm tracking-[0.3em] uppercase font-body font-medium">
                {slide.subtitle}
              </span>
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-secondary-foreground mt-3 mb-4 leading-tight">
                {slide.title}
              </h2>
              <p className="text-secondary-foreground/70 font-body text-sm md:text-base mb-8 max-w-md">
                {slide.description}
              </p>
              <Link
                to={slide.link}
                className="inline-block border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] uppercase font-body font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-500"
              >
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-secondary-foreground/50 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-secondary-foreground/50 hover:text-primary transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`h-0.5 transition-all duration-500 ${
              i === current ? "w-8 bg-primary" : "w-4 bg-secondary-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
