import type {
  Cart,
  CartItem,
  Collection,
  Menu,
  Money,
  Page,
  Product,
  ProductOption,
  ProductVariant,
} from "lib/commerce/types";

const USD = "USD";
const MOCK_TIMESTAMP = "2025-01-01T00:00:00.000Z";

type ProductSeed = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  colors: string[];
  sizes: string[];
  category: string;
  imageUrl: string;
  tags: string[];
  seoTitle?: string;
};

const priceToMoney = (amount: number): Money => ({
  amount: amount.toFixed(2),
  currencyCode: USD,
});

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const createOptions = (seed: ProductSeed): ProductOption[] => {
  const options: ProductOption[] = [];

  if (seed.colors.length) {
    options.push({
      id: `${seed.id}-color`,
      name: "Color",
      values: seed.colors,
    });
  }

  if (seed.sizes.length) {
    options.push({
      id: `${seed.id}-size`,
      name: "Size",
      values: seed.sizes,
    });
  }

  return options;
};

const createVariants = (seed: ProductSeed): ProductVariant[] => {
  const colors = seed.colors.length ? seed.colors : ["Standard"];
  const sizes = seed.sizes.length ? seed.sizes : ["One Size"];
  const basePrice = priceToMoney(seed.price);

  const variants: ProductVariant[] = [];

  for (const color of colors) {
    for (const size of sizes) {
      const idParts = [seed.id, slugify(color), slugify(size)]
        .filter(Boolean)
        .join("-");

      const selectedOptions: ProductVariant["selectedOptions"] = [];

      if (seed.colors.length) {
        selectedOptions.push({ name: "Color", value: color });
      }

      if (seed.sizes.length) {
        selectedOptions.push({ name: "Size", value: size });
      }

      variants.push({
        id: `variant-${idParts}`,
        title:
          seed.colors.length && seed.sizes.length
            ? `${color} / ${size}`
            : seed.colors.length
              ? color
              : size,
        availableForSale: true,
        selectedOptions,
        price: { ...basePrice },
      });
    }
  }

  return variants;
};

const createImages = (seed: ProductSeed) => {
  const primary = {
    url: `${seed.imageUrl}?auto=format&fit=crop&w=1200&q=80`,
    altText: `${seed.title} front view`,
    width: 1200,
    height: 1500,
  };
  const detail = {
    url: `${seed.imageUrl}?auto=format&fit=crop&w=1600&q=80&sat=-10`,
    altText: `${seed.title} detail`,
    width: 1600,
    height: 1600,
  };

  return [primary, detail];
};

const createProduct = (seed: ProductSeed): Product => {
  const priceMoney = priceToMoney(seed.price);
  const variants = createVariants(seed);
  const images = createImages(seed);
  const optionList = createOptions(seed);

  return {
    id: seed.id,
    handle: seed.handle,
    availableForSale: true,
    title: seed.title,
    description: seed.description,
    descriptionHtml: `<p>${seed.description}</p>`,
    options: optionList,
    priceRange: {
      minVariantPrice: { ...priceMoney },
      maxVariantPrice: { ...priceMoney },
    },
    variants,
    featuredImage: images[0]!,
    images,
    seo: {
      title: seed.seoTitle ?? seed.title,
      description: seed.description,
    },
    tags: Array.from(new Set([seed.category, ...seed.tags, "mock"])),
    updatedAt: MOCK_TIMESTAMP,
  };
};

const productSeeds: ProductSeed[] = [
  {
    id: "mock-product-001",
    handle: "luxe-cotton-tee",
    title: "Luxe Cotton Tee",
    description:
      "Ultra-soft Pima cotton tee with a tailored silhouette and reinforced neckline for everyday wear.",
    price: 38,
    colors: ["Black", "Ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "tops",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    tags: ["t-shirt", "cotton", "essentials"],
  },
  {
    id: "mock-product-002",
    handle: "everyday-oversized-tee",
    title: "Everyday Oversized Tee",
    description:
      "Relaxed fit tee with a dropped shoulder and garment-washed finish for a lived-in feel from day one.",
    price: 42,
    colors: ["Heather Gray", "Seafoam"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "tops",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    tags: ["t-shirt", "casual", "relaxed"],
  },
  {
    id: "mock-product-003",
    handle: "modern-crew-hoodie",
    title: "Modern Crew Hoodie",
    description:
      "Mid-weight fleece hoodie with ribbed side panels, double-lined hood, and hidden phone pocket.",
    price: 78,
    colors: ["Charcoal", "Soft Sand"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodies",
    imageUrl: "https://images.unsplash.com/photo-1503342250614-ca4407868a5b",
    tags: ["hoodie", "fleece", "layers"],
  },
  {
    id: "mock-product-004",
    handle: "downtown-denim-jacket",
    title: "Downtown Denim Jacket",
    description:
      "Japanese selvage denim jacket with brushed silver hardware and a modern cropped length.",
    price: 128,
    colors: ["Indigo"],
    sizes: ["S", "M", "L", "XL"],
    category: "outerwear",
    imageUrl: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb",
    tags: ["denim", "outerwear", "heritage"],
  },
  {
    id: "mock-product-005",
    handle: "sunrise-performance-leggings",
    title: "Sunrise Performance Leggings",
    description:
      "High-rise leggings with four-way stretch, sculpting seams, and moisture-wicking finish.",
    price: 68,
    colors: ["Deep Navy", "Merlot"],
    sizes: ["XS", "S", "M", "L"],
    category: "activewear",
    imageUrl: "https://images.unsplash.com/photo-1516815231560-8f41ec531527",
    tags: ["leggings", "active", "high-rise"],
  },
  {
    id: "mock-product-006",
    handle: "heritage-runner-sneaker",
    title: "Heritage Runner Sneaker",
    description:
      "Retro-inspired runner with suede overlays, ripstop panels, and cushioned EVA midsole.",
    price: 150,
    colors: ["Bone", "Olive"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    category: "footwear",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    tags: ["sneaker", "retro", "runner"],
  },
  {
    id: "mock-product-007",
    handle: "northwind-parka",
    title: "Northwind Parka",
    description:
      "Weatherproof parka with recycled fill, storm cuffs, and removable hood for adaptable warmth.",
    price: 220,
    colors: ["Forest", "Stone"],
    sizes: ["S", "M", "L", "XL"],
    category: "outerwear",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    tags: ["parka", "winter", "technical"],
  },
  {
    id: "mock-product-008",
    handle: "studio-relaxed-pant",
    title: "Studio Relaxed Pant",
    description:
      "Tapered pant cut from stretch twill with an elastic back waistband and clean front pleats.",
    price: 95,
    colors: ["Black", "Oat"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "bottoms",
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    tags: ["pant", "tailored", "versatile"],
  },
  {
    id: "mock-product-009",
    handle: "artisan-leather-bag",
    title: "Artisan Leather Bag",
    description:
      "Hand-finished vegetable-tanned leather tote with interior zip pocket and magnetic closure.",
    price: 210,
    colors: ["Cognac"],
    sizes: ["One Size"],
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    tags: ["bag", "leather", "handcrafted"],
  },
  {
    id: "mock-product-010",
    handle: "skyline-sport-cap",
    title: "Skyline Sport Cap",
    description:
      "Lightweight performance cap with laser-cut ventilation and moisture-wicking interior band.",
    price: 38,
    colors: ["Navy", "Rust"],
    sizes: ["One Size"],
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    tags: ["cap", "sport", "adjustable"],
  },
  {
    id: "mock-product-011",
    handle: "midtown-knit-dress",
    title: "Midtown Knit Dress",
    description:
      "Midi-length rib knit dress with side slits, mock neck, and comfortable stretch.",
    price: 145,
    colors: ["Cobalt", "Charcoal"],
    sizes: ["XS", "S", "M", "L"],
    category: "dresses",
    imageUrl: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
    tags: ["dress", "knit", "evening"],
  },
  {
    id: "mock-product-012",
    handle: "weekend-linen-shorts",
    title: "Weekend Linen Shorts",
    description:
      "Breathable linen blend shorts with adjustable drawcord and clean welt pockets.",
    price: 74,
    colors: ["Natural", "Sage"],
    sizes: ["S", "M", "L", "XL"],
    category: "bottoms",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    tags: ["shorts", "linen", "summer"],
  },
];

export const mockProducts: Product[] = productSeeds.map(createProduct);

export const homepageFeaturedHandles = [
  "luxe-cotton-tee",
  "everyday-oversized-tee",
  "modern-crew-hoodie",
];

export const homepageCarouselHandles = [
  "downtown-denim-jacket",
  "sunrise-performance-leggings",
  "heritage-runner-sneaker",
  "northwind-parka",
  "studio-relaxed-pant",
  "artisan-leather-bag",
  "skyline-sport-cap",
  "midtown-knit-dress",
];

export const mockCollections: Collection[] = [
  {
    handle: "featured",
    title: "Featured",
    description: "Editor-curated staples and seasonal standouts.",
    seo: {
      title: "Featured Collection",
      description: "Discover our favorite pieces of the season.",
    },
    updatedAt: MOCK_TIMESTAMP,
    path: "/search/featured",
  },
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    description: "Fresh silhouettes dropping every week.",
    seo: {
      title: "New Arrivals",
      description: "Stay ahead with the latest releases.",
    },
    updatedAt: MOCK_TIMESTAMP,
    path: "/search/new-arrivals",
  },
  {
    handle: "best-sellers",
    title: "Best Sellers",
    description: "Community-approved essentials worn on repeat.",
    seo: {
      title: "Best Sellers",
      description: "Shop the pieces customers can’t stop buying.",
    },
    updatedAt: MOCK_TIMESTAMP,
    path: "/search/best-sellers",
  },
  {
    handle: "active",
    title: "Activewear",
    description: "Performance layers for studio sessions and long runs.",
    seo: {
      title: "Activewear Collection",
      description: "Engineered for movement with technical fabrics.",
    },
    updatedAt: MOCK_TIMESTAMP,
    path: "/search/active",
  },
  {
    handle: "outerwear",
    title: "Outerwear",
    description: "All-season jackets, parkas, and weather-ready shells.",
    seo: {
      title: "Outerwear",
      description: "Layer up with parkas, bombers, and lightweight shells.",
    },
    updatedAt: MOCK_TIMESTAMP,
    path: "/search/outerwear",
  },
  {
    handle: "essentials",
    title: "Essentials",
    description: "Year-round staples built on premium fabrics.",
    seo: {
      title: "Essentials Collection",
      description: "Foundational pieces designed to mix and match.",
    },
    updatedAt: MOCK_TIMESTAMP,
    path: "/search/essentials",
  },
];

export const mockPages: Page[] = [
  {
    id: "mock-page-about",
    title: "About",
    handle: "about",
    body: "We design intentional wardrobe staples inspired by global cities and crafted with planet-conscious materials.",
    bodySummary: "Learn about our design ethos and commitment to better materials.",
    seo: {
      title: "About Us",
      description: "Our studio blends modern tailoring with responsible production.",
    },
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP,
  },
  {
    id: "mock-page-returns",
    title: "Returns & Exchanges",
    handle: "returns",
    body: "Returns are accepted within 30 days of delivery. Items must be unworn, unwashed, and include original tags.",
    bodySummary: "Read the full return and exchange policy.",
    seo: {
      title: "Returns & Exchanges",
      description: "Start a return and learn about eligibility windows.",
    },
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP,
  },
  {
    id: "mock-page-faq",
    title: "FAQ",
    handle: "faq",
    body: "Find quick answers about shipping timelines, restocks, and garment care recommendations.",
    bodySummary: "Common questions about shipping, sizing, and care.",
    seo: {
      title: "Frequently Asked Questions",
      description: "Shipping, sizing, and care answers in one place.",
    },
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP,
  },
  {
    id: "mock-page-sustainability",
    title: "Sustainability",
    handle: "sustainability",
    body: "Our fabrics prioritize recycled and regenerative fibers, and every supplier is audited for fair labor practices.",
    bodySummary: "Transparency around materials and manufacturing.",
    seo: {
      title: "Sustainability Practices",
      description: "See how we prioritize responsible materials and factories.",
    },
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP,
  },
  {
    id: "mock-page-shipping",
    title: "Shipping",
    handle: "shipping",
    body: "Domestic orders ship within 2 business days. Global delivery is available with duties calculated at checkout.",
    bodySummary: "Shipping timelines and international coverage.",
    seo: {
      title: "Shipping Information",
      description: "Track timelines and learn about worldwide delivery.",
    },
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP,
  },
];

export const mockMenus: Menu[] = [
  { title: "Home", path: "/" },
  { title: "New Arrivals", path: "/search/new-arrivals" },
  { title: "Women", path: "/search/women" },
  { title: "Men", path: "/search/men" },
  { title: "Accessories", path: "/search/accessories" },
  { title: "Sale", path: "/search/sale" },
];

const buildCartLine = (
  lineId: string,
  productHandle: string,
  variantTitle: string,
  quantity: number,
): CartItem => {
  const product = mockProducts.find((item) => item.handle === productHandle);
  if (!product) {
    throw new Error(`Unknown product handle: ${productHandle}`);
  }

  const variant = product.variants.find((item) => item.title === variantTitle);
  if (!variant) {
    throw new Error(
      `Unknown variant "${variantTitle}" for product ${productHandle}`,
    );
  }

  const lineTotal = (Number(variant.price.amount) * quantity).toFixed(2);

  return {
    id: lineId,
    quantity,
    cost: {
      totalAmount: {
        amount: lineTotal,
        currencyCode: USD,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
};

const cartLines: CartItem[] = [
  buildCartLine("mock-line-1", "luxe-cotton-tee", "Black / M", 1),
  buildCartLine("mock-line-2", "modern-crew-hoodie", "Charcoal / L", 1),
  buildCartLine("mock-line-3", "heritage-runner-sneaker", "Bone / 10", 1),
];

const cartSubtotal = cartLines
  .reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0,
  )
  .toFixed(2);

export const mockCart: Cart = {
  id: "mock-cart",
  checkoutUrl: "/checkout/mock",
  lines: cartLines,
  totalQuantity: cartLines.reduce((sum, line) => sum + line.quantity, 0),
  cost: {
    subtotalAmount: { amount: cartSubtotal, currencyCode: USD },
    totalAmount: { amount: cartSubtotal, currencyCode: USD },
    totalTaxAmount: { amount: "0.00", currencyCode: USD },
  },
};
