export type Product = {
  id: string;
  name: string;
  category: string;
  weight: number;
  makingCharges: number;
  description: string;
  images: string[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
};

export const categories = [
  { id: "rings", name: "Rings", icon: "💍" },
  { id: "earrings", name: "Earrings", icon: "✨" },
  { id: "necklaces", name: "Necklaces", icon: "📿" },
  { id: "bangles", name: "Bangles", icon: "⭕" },
  { id: "bracelets", name: "Bracelets", icon: "🔗" },
  { id: "chains", name: "Chains", icon: "⛓️" },
  { id: "pendants", name: "Pendants", icon: "💎" },
];

const generateProducts = (): Product[] => {
  const ringNames = [
    "Royal Heritage Ring", "Celestial Bloom Ring", "Maharani Solitaire", "Eternal Knot Band",
    "Lotus Petal Ring", "Diamond Halo Ring", "Vintage Filigree Ring", "Mogul Crown Ring",
    "Twisted Vine Ring", "Classic Signet Ring", "Pearl Cluster Ring", "Art Deco Ring",
    "Infinity Promise Ring", "Temple Dome Ring", "Aurora Borealis Ring"
  ];

  const earringNames = [
    "Chandelier Drop Earrings", "Jhumka Heritage Earrings", "Diamond Stud Earrings",
    "Peacock Feather Drops", "Gold Hoop Earrings", "Kundan Chandbali", "Ruby Cascade Earrings",
    "Pearl Button Earrings", "Floral Cluster Studs", "Geometric Dangle Earrings",
    "Temple Bell Earrings", "Crescent Moon Earrings", "Tassel Drop Earrings", "Emerald Stud Earrings"
  ];

  const necklaceNames = [
    "Maharani Choker Set", "Layered Temple Necklace", "Diamond Rivière Necklace",
    "Kundan Bridal Set", "Polki Heritage Necklace", "Pearl Strand Necklace",
    "Gold Filigree Chain", "Ruby Cluster Necklace", "Antique Coin Necklace",
    "Emerald Statement Necklace", "Hasli Gold Necklace", "Lakshmi Haar", "Opera Length Chain"
  ];

  const bangleNames = [
    "Traditional Kada Bangle", "Diamond Studded Bangle", "Twisted Gold Bangle",
    "Meenakari Bangle Set", "Slim Stackable Bangles", "Rajasthani Broad Bangle",
    "Floral Cutwork Bangle", "Stone Encrusted Bangle", "Plain Polished Bangle",
    "Antique Finish Bangle", "Navratan Bangle", "Celtic Knot Bangle"
  ];

  const braceletNames = [
    "Tennis Diamond Bracelet", "Chain Link Bracelet", "Charm Bracelet Gold",
    "Cuff Statement Bracelet", "Pearl Strand Bracelet", "Herringbone Bracelet",
    "Byzantine Chain Bracelet", "Flexible Mesh Bracelet", "Bangle Bracelet Hybrid"
  ];

  const chainNames = [
    "Rope Chain 22K", "Box Chain Delicate", "Figaro Chain Classic", "Cuban Link Chain",
    "Wheat Chain Fine", "Singapore Twist Chain", "Belcher Chain Bold",
    "Venetian Box Chain", "Anchor Marine Chain"
  ];

  const pendantNames = [
    "Ganesh Om Pendant", "Diamond Solitaire Pendant", "Heart Locket Pendant",
    "Peacock Pendant", "Evil Eye Pendant", "Cross Pendant Gold",
    "Lotus Pendant", "Star Burst Pendant", "Hamsa Hand Pendant",
    "Initial Letter Pendant", "Medallion Pendant"
  ];

  const allItems: { names: string[]; category: string }[] = [
    { names: ringNames, category: "rings" },
    { names: earringNames, category: "earrings" },
    { names: necklaceNames, category: "necklaces" },
    { names: bangleNames, category: "bangles" },
    { names: braceletNames, category: "bracelets" },
    { names: chainNames, category: "chains" },
    { names: pendantNames, category: "pendants" },
  ];

  const products: Product[] = [];
  let id = 1;

  const descriptions: Record<string, string> = {
    rings: "Exquisitely crafted in premium gold, this ring features intricate detailing and a timeless design that elevates any ensemble.",
    earrings: "These stunning earrings showcase masterful craftsmanship with delicate patterns that catch the light beautifully.",
    necklaces: "A magnificent piece that drapes elegantly, this necklace is a testament to the artistry of traditional Indian jewelry making.",
    bangles: "This bangle embodies grace and tradition, with hand-finished details that make it a cherished addition to any collection.",
    bracelets: "A sophisticated bracelet combining modern design with classic gold craftsmanship for everyday luxury.",
    chains: "Crafted with precision, this chain features a strong yet elegant design suitable for pendants or standalone wear.",
    pendants: "This pendant is a miniature work of art, featuring detailed craftsmanship that carries deep symbolic meaning.",
  };

  allItems.forEach(({ names, category }) => {
    names.forEach((name, i) => {
      const weight = category === "necklaces" ? 15 + Math.random() * 40 :
        category === "bangles" ? 10 + Math.random() * 25 :
        category === "chains" ? 8 + Math.random() * 20 :
        category === "bracelets" ? 6 + Math.random() * 15 :
        2 + Math.random() * 12;

      products.push({
        id: `prod-${id++}`,
        name,
        category,
        weight: parseFloat(weight.toFixed(2)),
        makingCharges: Math.round((500 + Math.random() * 4500) / 100) * 100,
        description: descriptions[category],
        images: [`/placeholder.svg`],
        featured: i < 2,
        bestSeller: i >= 2 && i < 4,
        newArrival: i >= 4 && i < 6,
      });
    });
  });

  return products;
};

export const products = generateProducts();

export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category === category);

export const getFeaturedProducts = () => products.filter((p) => p.featured);
export const getBestSellers = () => products.filter((p) => p.bestSeller);
export const getNewArrivals = () => products.filter((p) => p.newArrival);
export const getProductById = (id: string) => products.find((p) => p.id === id);

/**
 * Calculate the final price of a product based on:
 * - weight: weight in grams
 * - makingCharges: making charges in INR
 * - ratePerGram: LIVE rate per gram (from GoldRateContext), defaults to 22K rate
 * 
 * Formula: metalCost = rate × weight
 *          GST = 3% on (metalCost + makingCharges)
 *          total = metalCost + makingCharges + GST
 */
export const calculatePrice = (weight: number, makingCharges: number, ratePerGram: number) => {
  const metalCost = ratePerGram * weight;
  const gst = (metalCost + makingCharges) * 0.03;
  return {
    metalCost: Math.round(metalCost),
    makingCharges,
    gst: Math.round(gst),
    total: Math.round(metalCost + makingCharges + gst),
  };
};
