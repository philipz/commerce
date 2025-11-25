import { NextResponse } from "next/server";
import {
    Cart,
    Collection,
    Menu,
    Page,
    Product,
} from "../types";
import { mockCollections, mockMenu, mockPages, mockProducts } from "./data";

// Mock Cart (In-memory for simplicity, or use cookies/local storage in a real app)
// Since this runs on the server, in-memory won't persist across requests in serverless.
// But for a simple mock, we can just return a static cart or try to simulate it.
// For now, we'll return a static empty cart or a cart with items if requested.

const mockCart: Cart = {
    id: "mock-cart-id",
    checkoutUrl: "/checkout",
    cost: {
        subtotalAmount: { amount: "0.00", currencyCode: "USD" },
        totalAmount: { amount: "0.00", currencyCode: "USD" },
        totalTaxAmount: { amount: "0.00", currencyCode: "USD" },
    },
    lines: [],
    totalQuantity: 0,
};

export async function createCart(): Promise<Cart> {
    return mockCart;
}

export async function addToCart(
    lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
    // In a real mock, we would update the cart state.
    // Here we just return the empty cart for simplicity, or maybe a cart with the added item.
    return {
        ...mockCart,
        totalQuantity: lines.reduce((acc, line) => acc + line.quantity, 0),
    };
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
    return mockCart;
}

export async function updateCart(
    lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
    return mockCart;
}

export async function getCart(): Promise<Cart | undefined> {
    return mockCart;
}

export async function getCollection(
    handle: string,
): Promise<Collection | undefined> {
    return mockCollections.find((c) => c.handle === handle);
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
    if (collection === "hidden-homepage-carousel") {
        return mockProducts;
    }

    if (collection === "hidden-homepage-featured-items") {
        return mockProducts;
    }

    // Filter by collection/tag
    // For simplicity, we assume collection handle matches a tag or just return all products if 'all'
    return mockProducts.filter((p) => p.tags.includes(collection) || collection === 'all');
}

export async function getCollections(): Promise<Collection[]> {
    return mockCollections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
    return mockMenu;
}

export async function getPage(handle: string): Promise<Page> {
    return (
        mockPages.find((p) => p.handle === handle) || {
            id: "404",
            title: "Not Found",
            handle: "not-found",
            body: "",
            bodySummary: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    );
}

export async function getPages(): Promise<Page[]> {
    return mockPages;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
    return mockProducts.find((p) => p.handle === handle);
}

export async function getProductRecommendations(
    productId: string,
): Promise<Product[]> {
    return mockProducts.slice(0, 3);
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
    // Simple search
    if (query) {
        return mockProducts.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase()),
        );
    }
    return mockProducts;
}

export async function revalidate(req: any): Promise<NextResponse> {
    return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
