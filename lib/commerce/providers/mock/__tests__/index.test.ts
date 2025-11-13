import { describe, expect, it } from "vitest";
import mockProvider from "../index";

describe("mock commerce provider", () => {
  it("returns catalog data for products, collections, and pages", async () => {
    const [products, collections, pages] = await Promise.all([
      mockProvider.getProducts({}),
      mockProvider.getCollections(),
      mockProvider.getPages(),
    ]);

    expect(products.length).toBeGreaterThan(0);
    expect(collections.length).toBeGreaterThan(0);
    expect(pages.length).toBeGreaterThan(0);
  });

  it("supports full cart lifecycle", async () => {
    const products = await mockProvider.getProducts({});
    const variant = products[0].variants[0];

    const cartAfterAdd = await mockProvider.addToCart([
      { merchandiseId: variant.id, quantity: 1 },
    ]);
    expect(cartAfterAdd.totalQuantity).toBe(1);

    const line = cartAfterAdd.lines[0];
    const cartAfterUpdate = await mockProvider.updateCart([
      {
        id: line.id!,
        merchandiseId: line.merchandise.id,
        quantity: 2,
      },
    ]);
    expect(cartAfterUpdate.totalQuantity).toBe(2);

    const cartAfterRemove = await mockProvider.removeFromCart([line.id!]);
    expect(cartAfterRemove.totalQuantity).toBe(0);
  });
});
