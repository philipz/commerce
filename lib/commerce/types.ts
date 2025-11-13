/**
 * Utility type to express optional GraphQL fields that may be `null`.
 */
export type Maybe<T> = T | null;

/**
 * GraphQL connection wrapper providing access to paginated edges.
 */
export type Connection<T> = {
  edges: Array<Edge<T>>;
};

/**
 * GraphQL edge entry containing the node payload.
 */
export type Edge<T> = {
  node: T;
};

/**
 * Monetary value with currency awareness.
 */
export type Money = {
  amount: string;
  currencyCode: string;
};

/**
 * Generic media/image representation used across providers.
 */
export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

/**
 * Basic SEO metadata container for any resource.
 */
export type SEO = {
  title: string;
  description: string;
};

/**
 * Structured option for configurable products (e.g., size, color).
 */
export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

/**
 * Individual sellable product variant, including pricing info.
 */
export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

/**
 * Primary product record consumed by UI layers.
 */
export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

/**
 * Product reference stored on cart line items.
 */
export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

/**
 * Individual line item within a cart.
 */
export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

/**
 * Aggregate cart information rendered throughout the storefront.
 */
export type Cart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};

/**
 * Generic collection grouping products for merchandising.
 */
export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  path: string;
};

/**
 * Navigation menu entry rendered by the layout.
 */
export type Menu = {
  title: string;
  path: string;
};

/**
 * Content page (e.g., About, FAQ) consumed by CMS-like surfaces.
 */
export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};
