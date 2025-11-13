import type { NextRequest, NextResponse } from "next/server";
import type { CommerceProvider } from "../../provider.interface";
import type { Cart, Collection, Menu, Page, Product } from "../../types";
import {
  homepageCarouselHandles,
  homepageFeaturedHandles,
  mockCart,
  mockCollections,
  mockMenus,
  mockPages,
  mockProducts,
} from "./data";

/**
 * In-memory cart storage for the mock provider.
 * In a real application, this would be persisted to a database or cache.
 */
const cartStorage = new Map<string, Cart>();

/**
 * Simulate async API delay for realistic behavior.
 */
const delay = (ms: number = 50) => new Promise((resolve) => setTimeout(resolve, ms));

const selectProductsByHandle = (handles: string[]) =>
  handles
    .map((handle) => mockProducts.find((product) => product.handle === handle))
    .filter((product): product is Product => Boolean(product));

/**
 * Mock commerce provider for local development and testing.
 * Provides realistic ecommerce functionality without external dependencies.
 */
const mockProvider: CommerceProvider = {
  name: "mock",
  requiredEnvVars: [],

  // ==================== Cart Operations ====================

  async createCart(): Promise<Cart> {
    await delay(100);

    const cartId = `mock-cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newCart: Cart = {
      id: cartId,
      checkoutUrl: `https://example.com/checkout/${cartId}`,
      cost: {
        subtotalAmount: { amount: "0.00", currencyCode: "USD" },
        totalAmount: { amount: "0.00", currencyCode: "USD" },
        totalTaxAmount: { amount: "0.00", currencyCode: "USD" },
      },
      lines: [],
      totalQuantity: 0,
    };

    cartStorage.set(cartId, newCart);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Created cart: ${cartId}`);
    }

    return newCart;
  },

  async getCart(cartId?: string): Promise<Cart | undefined> {
    await delay(50);

    if (!cartId) {
      return undefined;
    }

    const cart = cartStorage.get(cartId);

    if (process.env.NODE_ENV === "development" && cart) {
      console.log(`[Mock Provider] Retrieved cart: ${cartId}`);
    }

    return cart;
  },

  async addToCart(lines): Promise<Cart> {
    await delay(100);

    // For mock, we'll get the cart from cookie or create a new one
    // In reality, the application layer handles cart ID via cookies
    const cartId = Array.from(cartStorage.keys())[0] || `mock-cart-${Date.now()}`;
    let cart = cartStorage.get(cartId);

    if (!cart) {
      cart = await mockProvider.createCart();
    }

    // Add new lines to cart
    for (const line of lines) {
      // Find the product and variant
      const product = mockProducts.find((p) =>
        p.variants.some((v) => v.id === line.merchandiseId),
      );

      if (!product) {
        throw new Error(`Product not found for merchandise: ${line.merchandiseId}`);
      }

      const variant = product.variants.find((v) => v.id === line.merchandiseId);

      if (!variant) {
        throw new Error(`Variant not found: ${line.merchandiseId}`);
      }

      const lineId = `mock-line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const lineTotal = parseFloat(variant.price.amount) * line.quantity;

      cart.lines.push({
        id: lineId,
        quantity: line.quantity,
        cost: {
          totalAmount: { amount: lineTotal.toFixed(2), currencyCode: "USD" },
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
      });
    }

    // Recalculate totals
    const subtotal = cart.lines.reduce(
      (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
      0,
    );
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    cart.cost = {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
      totalAmount: { amount: total.toFixed(2), currencyCode: "USD" },
      totalTaxAmount: { amount: tax.toFixed(2), currencyCode: "USD" },
    };

    cart.totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);

    cartStorage.set(cart.id!, cart);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Added ${lines.length} item(s) to cart: ${cart.id}`);
    }

    return cart;
  },

  async updateCart(lines): Promise<Cart> {
    await delay(100);

    const cartId = Array.from(cartStorage.keys())[0];

    if (!cartId) {
      throw new Error("Cart not found");
    }

    const cart = cartStorage.get(cartId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Update line quantities
    for (const update of lines) {
      const lineIndex = cart.lines.findIndex((line) => line.id === update.id);

      if (lineIndex >= 0) {
        const lineItem = cart.lines[lineIndex];
        if (!lineItem) continue;
        const currentQuantity = lineItem.quantity || 1;
        const unitPrice =
          parseFloat(lineItem.cost.totalAmount.amount) / currentQuantity;
        lineItem.quantity = update.quantity;
        const newTotal = unitPrice * update.quantity;
        lineItem.cost.totalAmount.amount = newTotal.toFixed(2);
      }
    }

    // Recalculate cart totals
    const subtotal = cart.lines.reduce(
      (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
      0,
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    cart.cost = {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
      totalAmount: { amount: total.toFixed(2), currencyCode: "USD" },
      totalTaxAmount: { amount: tax.toFixed(2), currencyCode: "USD" },
    };

    cart.totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);

    cartStorage.set(cart.id!, cart);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Updated cart: ${cart.id}`);
    }

    return cart;
  },

  async removeFromCart(lineIds): Promise<Cart> {
    await delay(100);

    const cartId = Array.from(cartStorage.keys())[0];

    if (!cartId) {
      throw new Error("Cart not found");
    }

    const cart = cartStorage.get(cartId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Remove lines
    cart.lines = cart.lines.filter((line) => !lineIds.includes(line.id!));

    // Recalculate totals
    const subtotal = cart.lines.reduce(
      (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
      0,
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    cart.cost = {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
      totalAmount: { amount: total.toFixed(2), currencyCode: "USD" },
      totalTaxAmount: { amount: tax.toFixed(2), currencyCode: "USD" },
    };

    cart.totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);

    cartStorage.set(cart.id!, cart);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Removed ${lineIds.length} item(s) from cart: ${cart.id}`);
    }

    return cart;
  },

  // ==================== Product Operations ====================

  async getProduct(handle): Promise<Product | undefined> {
    await delay(50);

    const product = mockProducts.find((p) => p.handle === handle);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Get product: ${handle} - ${product ? "found" : "not found"}`);
    }

    return product;
  },

  async getProducts(options): Promise<Product[]> {
    await delay(100);

    let products = [...mockProducts];

    // Apply search query filter
    if (options.query) {
      const query = options.query.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply sorting
    if (options.sortKey) {
      switch (options.sortKey) {
        case "PRICE":
          products.sort(
            (a, b) =>
              parseFloat(a.priceRange.minVariantPrice.amount) -
              parseFloat(b.priceRange.minVariantPrice.amount),
          );
          break;
        case "TITLE":
          products.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "CREATED_AT":
        case "CREATED":
          products.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
          break;
      }
    }

    // Apply reverse
    if (options.reverse) {
      products.reverse();
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Mock Provider] Get products: query="${options.query || ""}", count=${products.length}`,
      );
    }

    return products;
  },

  async getProductRecommendations(productId): Promise<Product[]> {
    await delay(75);

    // Return 3 random products as recommendations
    const otherProducts = mockProducts.filter((p) => p.id !== productId);
    const recommendations = otherProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Get recommendations for: ${productId}`);
    }

    return recommendations;
  },

  // ==================== Collection Operations ====================

  async getCollection(handle): Promise<Collection | undefined> {
    await delay(50);

    const collection = mockCollections.find((c) => c.handle === handle);

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Mock Provider] Get collection: ${handle} - ${collection ? "found" : "not found"}`,
      );
    }

    return collection;
  },

  async getCollections(): Promise<Collection[]> {
    await delay(75);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Get all collections: ${mockCollections.length} found`);
    }

    return mockCollections;
  },

  async getCollectionProducts(options): Promise<Product[]> {
    await delay(100);

    let products = [...mockProducts];

    // Filter by collection
    switch (options.collection) {
      case "hidden-homepage-featured-items":
        products = selectProductsByHandle(homepageFeaturedHandles);
        break;
      case "hidden-homepage-carousel":
        products = selectProductsByHandle(homepageCarouselHandles);
        break;
      case "featured":
        products = products.filter((p) => p.tags.includes("featured"));
        break;
      case "apparel":
        products = products.filter(
          (p) => p.tags.includes("t-shirt") || p.tags.includes("hoodie"),
        );
        break;
      case "accessories":
        products = products.filter((p) => p.tags.includes("accessories"));
        break;
      case "new-arrivals":
        // Return newest products (last 6)
        products = products.slice(-6);
        break;
      case "sale":
        // Return random subset as "sale" items
        products = products.filter((_, i) => i % 3 === 0);
        break;
      // "all" or unknown collection returns all products
    }

    // Apply sorting
    if (options.sortKey) {
      switch (options.sortKey) {
        case "PRICE":
          products.sort(
            (a, b) =>
              parseFloat(a.priceRange.minVariantPrice.amount) -
              parseFloat(b.priceRange.minVariantPrice.amount),
          );
          break;
        case "TITLE":
          products.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "CREATED_AT":
        case "CREATED":
          products.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
          break;
      }
    }

    // Apply reverse
    if (options.reverse) {
      products.reverse();
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Mock Provider] Get collection products: collection="${options.collection}", count=${products.length}`,
      );
    }

    return products;
  },

  // ==================== Content Operations ====================

  async getPage(handle): Promise<Page> {
    await delay(50);

    const page = mockPages.find((p) => p.handle === handle);

    if (!page) {
      throw new Error(`Page not found: ${handle}`);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Get page: ${handle}`);
    }

    return page;
  },

  async getPages(): Promise<Page[]> {
    await delay(50);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Get all pages: ${mockPages.length} found`);
    }

    return mockPages;
  },

  async getMenu(handle): Promise<Menu[]> {
    await delay(50);

    const menu = mockMenus;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mock Provider] Get menu: ${handle} - ${menu.length} items`);
    }

    return menu;
  },

  // ==================== Webhook & Revalidation ====================

  async revalidate(req): Promise<NextResponse> {
    // Mock provider doesn't need actual revalidation
    // Just return success for webhook compatibility
    if (process.env.NODE_ENV === "development") {
      console.log("[Mock Provider] Revalidation webhook received (no-op for mock data)");
    }

    return new Response(JSON.stringify({ status: 200, mock: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }) as unknown as NextResponse;
  },
};

export default mockProvider;
