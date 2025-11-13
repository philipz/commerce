import type { NextRequest, NextResponse } from "next/server";
import type { Cart, Collection, Menu, Page, Product } from "./types";

/**
 * Input type for adding items to cart.
 */
export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

/**
 * Input type for updating cart items.
 */
export type CartLineUpdateInput = {
  id: string;
  merchandiseId: string;
  quantity: number;
};

/**
 * Query options for fetching products.
 */
export type ProductQueryOptions = {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
};

/**
 * Query options for fetching collection products.
 */
export type CollectionQueryOptions = {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
};

/**
 * CommerceProvider defines the contract for all commerce backend integrations.
 * Each provider (Shopify, Mock, custom implementations) must implement this interface
 * to ensure consistent behavior across the application.
 *
 * @example
 * ```typescript
 * const shopifyProvider: CommerceProvider = {
 *   name: 'shopify',
 *   requiredEnvVars: ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'],
 *   async createCart() { ... },
 *   async getCart(cartId) { ... },
 *   // ... implement all other methods
 * };
 * ```
 */
export interface CommerceProvider {
  /**
   * Provider name identifier (e.g., "shopify", "mock", "bigcommerce").
   */
  name: string;

  /**
   * List of required environment variables for this provider.
   * The provider factory will validate these are set before instantiation.
   */
  requiredEnvVars: string[];

  // ==================== Cart Operations ====================

  /**
   * Create a new empty shopping cart.
   *
   * @returns Promise resolving to the newly created cart
   * @throws {CommerceError} If cart creation fails
   */
  createCart(): Promise<Cart>;

  /**
   * Retrieve an existing cart by ID.
   *
   * @param cartId - Optional cart identifier (may be read from cookies)
   * @returns Promise resolving to cart if found, undefined if not found or expired
   * @throws {CommerceError} If cart retrieval fails (not including "not found")
   */
  getCart(cartId?: string): Promise<Cart | undefined>;

  /**
   * Add one or more items to an existing cart.
   *
   * @param lines - Array of items to add (merchandise ID and quantity)
   * @returns Promise resolving to the updated cart
   * @throws {CommerceError} If adding items fails
   */
  addToCart(lines: CartLineInput[]): Promise<Cart>;

  /**
   * Update quantities of existing cart items.
   *
   * @param lines - Array of cart line updates (line ID, merchandise ID, new quantity)
   * @returns Promise resolving to the updated cart
   * @throws {CommerceError} If updating cart fails
   */
  updateCart(lines: CartLineUpdateInput[]): Promise<Cart>;

  /**
   * Remove items from cart by line ID.
   *
   * @param lineIds - Array of cart line IDs to remove
   * @returns Promise resolving to the updated cart
   * @throws {CommerceError} If removing items fails
   */
  removeFromCart(lineIds: string[]): Promise<Cart>;

  // ==================== Product Operations ====================

  /**
   * Fetch a single product by its handle (URL slug).
   *
   * @param handle - Product handle/slug
   * @returns Promise resolving to product if found, undefined if not found
   * @throws {CommerceError} If product fetch fails
   */
  getProduct(handle: string): Promise<Product | undefined>;

  /**
   * Fetch multiple products with optional filtering and sorting.
   *
   * @param options - Query options including search query, sort key, and reverse flag
   * @returns Promise resolving to array of products (may be empty)
   * @throws {CommerceError} If product query fails
   */
  getProducts(options: ProductQueryOptions): Promise<Product[]>;

  /**
   * Fetch recommended products based on a given product.
   *
   * @param productId - ID of the reference product
   * @returns Promise resolving to array of recommended products (may be empty)
   * @throws {CommerceError} If recommendations fetch fails
   */
  getProductRecommendations(productId: string): Promise<Product[]>;

  // ==================== Collection Operations ====================

  /**
   * Fetch a single collection by handle.
   *
   * @param handle - Collection handle/slug
   * @returns Promise resolving to collection if found, undefined if not found
   * @throws {CommerceError} If collection fetch fails
   */
  getCollection(handle: string): Promise<Collection | undefined>;

  /**
   * Fetch all available collections.
   *
   * @returns Promise resolving to array of collections (may be empty)
   * @throws {CommerceError} If collections fetch fails
   */
  getCollections(): Promise<Collection[]>;

  /**
   * Fetch products within a specific collection with optional sorting.
   *
   * @param options - Query options including collection handle, sort key, and reverse flag
   * @returns Promise resolving to array of products in collection (may be empty)
   * @throws {CommerceError} If collection products fetch fails
   */
  getCollectionProducts(options: CollectionQueryOptions): Promise<Product[]>;

  // ==================== Content Operations ====================

  /**
   * Fetch a single page by handle (e.g., "about", "faq").
   *
   * @param handle - Page handle/slug
   * @returns Promise resolving to page content
   * @throws {CommerceError} If page fetch fails or page not found
   */
  getPage(handle: string): Promise<Page>;

  /**
   * Fetch all available pages.
   *
   * @returns Promise resolving to array of pages (may be empty)
   * @throws {CommerceError} If pages fetch fails
   */
  getPages(): Promise<Page[]>;

  /**
   * Fetch navigation menu items by menu handle.
   *
   * @param handle - Menu handle identifier
   * @returns Promise resolving to array of menu items (may be empty)
   * @throws {CommerceError} If menu fetch fails
   */
  getMenu(handle: string): Promise<Menu[]>;

  // ==================== Webhook & Revalidation ====================

  /**
   * Handle webhook requests for cache revalidation.
   * Provider should validate webhook secret and revalidate appropriate cache tags.
   *
   * @param req - Next.js request object containing webhook payload and headers
   * @returns Promise resolving to Next.js response (typically 200 or 401)
   */
  revalidate(req: NextRequest): Promise<NextResponse>;
}
