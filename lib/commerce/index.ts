import collectionsData from "lib/db/collections.json";
import menuData from "lib/db/menu.json";
import pagesData from "lib/db/pages.json";
import productsData from "lib/db/products.json";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Cart, Collection, Menu, Page, Product } from "./types";

// Mock database for carts (in-memory for now, or could be file-based if needed persistence across restarts)
// Since this is a dev/demo mode, in-memory is fine, but per-request isolation is better.
// For simplicity, we'll use a simple in-memory store that resets on server restart.
const carts: Record<string, Cart> = {};

const reshapeProduct = (product: any) => {
  // In our mock data, the structure is already close to what we want,
  // but we might need to ensure it matches the `Product` type exactly.
  return product as Product;
};

export async function createCart(): Promise<Cart> {
  const cartId = Math.random().toString(36).substring(7);
  const newCart: Cart = {
    id: cartId,
    checkoutUrl: "/checkout",
    cost: {
      subtotalAmount: { amount: "0.0", currencyCode: "USD" },
      totalAmount: { amount: "0.0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0.0", currencyCode: "USD" },
    },
    lines: [],
    totalQuantity: 0,
  };
  carts[cartId] = newCart;

  // Set cookie
  (await cookies()).set("cartId", cartId);

  return newCart;
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  let cartId = (await cookies()).get("cartId")?.value;
  if (!cartId || !carts[cartId]) {
    const cart = await createCart();
    cartId = cart.id!;
  }

  const cart = carts[cartId];
  if (!cart) {
    return createCart();
  }

  for (const line of lines) {
    const product = productsData.find((p) =>
      p.variants.some((v) => v.id === line.merchandiseId),
    );

    if (!product) continue;

    const variant = product.variants.find((v) => v.id === line.merchandiseId);
    if (!variant) continue;

    const existingLine = cart.lines.find(
      (l) => l.merchandise.id === line.merchandiseId,
    );

    if (existingLine) {
      existingLine.quantity += line.quantity;
      existingLine.cost.totalAmount.amount = (
        parseFloat(existingLine.cost.totalAmount.amount) +
        parseFloat(variant.price.amount) * line.quantity
      ).toString();
    } else {
      cart.lines.push({
        id: Math.random().toString(36).substring(7),
        quantity: line.quantity,
        cost: {
          totalAmount: {
            amount: (
              parseFloat(variant.price.amount) * line.quantity
            ).toString(),
            currencyCode: variant.price.currencyCode,
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
      });
    }
  }

  recalculateCart(cart);
  return cart;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId || !carts[cartId]) {
    return createCart();
  }

  const cart = carts[cartId];
  cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id!));
  recalculateCart(cart);
  return cart;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId || !carts[cartId]) {
    return createCart();
  }

  const cart = carts[cartId];

  for (const line of lines) {
    const cartLine = cart.lines.find((l) => l.id === line.id);
    if (!cartLine) continue;

    const product = productsData.find((p) =>
      p.variants.some((v) => v.id === line.merchandiseId),
    );
    if (!product) continue;

    const variant = product.variants.find((v) => v.id === line.merchandiseId);
    if (!variant) continue;

    cartLine.quantity = line.quantity;
    cartLine.cost.totalAmount.amount = (
      parseFloat(variant.price.amount) * line.quantity
    ).toString();
  }

  recalculateCart(cart);
  return cart;
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) return undefined;
  return carts[cartId];
}

function recalculateCart(cart: Cart) {
  let total = 0;
  let quantity = 0;

  for (const line of cart.lines) {
    total += parseFloat(line.cost.totalAmount.amount);
    quantity += line.quantity;
  }

  cart.cost.totalAmount.amount = total.toString();
  cart.cost.subtotalAmount.amount = total.toString();
  cart.totalQuantity = quantity;
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  return collectionsData.find((c) => c.handle === handle) as
    | Collection
    | undefined;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  // In a real app, we would filter by collection.
  // For mock data, we'll return all products for now, or filter if we add collection info to products.
  // Let's just return all products for simplicity as the mock data is small.
  let products = productsData as Product[];

  if (sortKey === "PRICE") {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? priceB - priceA : priceA - priceB;
    });
  }

  return products;
}

export async function getCollections(): Promise<Collection[]> {
  return collectionsData as Collection[];
}

export async function getMenu(handle: string): Promise<Menu[]> {
  return menuData;
}

export async function getPage(handle: string): Promise<Page | undefined> {
  return pagesData.find((p) => p.handle === handle) as Page | undefined;
}

export async function getPages(): Promise<Page[]> {
  return pagesData as Page[];
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return productsData.find((p) => p.handle === handle) as Product | undefined;
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  return productsData.slice(0, 3) as Product[];
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  let products = productsData as Product[];

  if (query) {
    products = products.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  return products;
}

export async function revalidate(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
